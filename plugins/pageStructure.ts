import { uuid } from '@sanity/uuid'
import { ComponentType, ReactNode } from 'react'
import { DocumentDefinition, User } from 'sanity'

import {
  DESK_NAME,
  documentPreviewPanes,
  singletonDocumentTypes,
  typesWithCustomFilters,
} from 'lib/constants'
import { apiVersion } from 'lib/sanity.api'

import type { ListItemBuilder } from '@sanity/structure/lib/ListItem'

import {
  Divider,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure'
import navigationStructure from './navigationStructure'

type FilteredDocumentDefinition = DocumentDefinition & {
  filter: string
}

// define new pageStructure list item type for legibility and organization
type TopLevelListDefinition = {
  type: 'list'
  title: string
  name?: string
  icon: JSX.Element | ComponentType | ReactNode
  typeDefs: (
    | DocumentDefinition
    | FilteredDocumentDefinition
    | TopLevelListDefinition
  )[]
  filter?: string
}

// TODO: replace deprecated type
type ListItem = (TopLevelListDefinition | Divider | DocumentDefinition) & {
  type: 'list' | 'divider' | 'document'
}

const createNewDocumentFromTopLevelTypes = {
  'New Checkout': 'checkout',
}

const getFilter = (title: string) => {
  switch (title) {
    case 'Hot Checkouts':
      return `_type == "checkout" && isCheckedOut && !isReturned`
    case 'Cold Checkouts':
      return `_type == "checkout" && isReturned`
    case 'Pending Checkouts':
      return `_type == "checkout" && !isCheckedOut`
    case 'Available Items':
      return `_type == "item" && stock > 0`
    case 'Unavailable Items':
      return `_type == "item" && stock == 0`
    case 'All Variants':
      return `_type == "item" && (isVariant || defined(variants))`
    default:
      return `_type == $type && !isVariant`
  }
}

export const previewPanes = (S, type) => [
  S.view.form().title('Edit'),
  ...documentPreviewPanes[type.name || '']?.map((pane) =>
    S.view.component(pane.component).title(pane.title || 'Preview')
  ),
]

/***
 * This returns a list item builder for a singleton document type
 */
const singletonListItemBuilder = (
  // TODO: replace deprecated type
  S: StructureBuilder,
  type: DocumentDefinition
): ListItemBuilder =>
  S.listItem()
    .title(type.title || type.name)
    .icon(type.icon)
    .child(
      Object.keys(documentPreviewPanes).includes(type.name)
        ? S.editor()
            .id(type.name)
            .schemaType(type.name)
            .documentId(type.name)
            .title('type.title || type.name')
            .views([...previewPanes(S, type)])
        : S.editor()
            .id(type.name)
            .schemaType(type.name)
            .documentId(type.name)
            .title(type.title || type.name)
    )

/***
 * This returns a list item builder for a non-singleton document type
 */
const documentListItemBuilder = (
  S: StructureBuilder,
  type: DocumentDefinition,
  currentUser?: User | null
): ListItemBuilder =>
  S.listItem()
    .title(type.title || type.name)
    .icon(type.icon)
    .child(
      createNewDocumentFromTopLevelTypes.hasOwnProperty(type.title || '')
        ? S.editor()
            .id(type.name)
            .schemaType(type.name)
            .documentId(uuid())
            .title(type.title || type.name)
            .views([S.view.form().title('Edit')])
            .initialValueTemplate('current-user-checkout', {
              userId: currentUser?.id,
              currentUser: currentUser,
            })
        : singletonDocumentTypes.includes(type.name)
        ? Object.keys(documentPreviewPanes).includes(type.name)
          ? S.editor()
              .id(type.name)
              .schemaType(type.name)
              .documentId(type.name)
              .title(type.title || type.name)
              .views([...previewPanes(S, type)])
          : S.editor()
              .id(type.name)
              .schemaType(type.name)
              .documentId(type.name)
              .title(type.title || type.name)
        : S.documentList()
            // FIXME: find the lastest way to add ordering in the
            // structure builder API
            // @ts-ignore
            .menuItems([...S.documentTypeList(type.name).getMenuItems()])
            .title(type.title || type.name)
            .filter(
              typesWithCustomFilters.includes(type.name)
                ? getFilter(type.title || '')
                : `_type == $type`
            )
            .initialValueTemplates([
              S.initialValueTemplateItem('current-user-checkout', {
                userId: currentUser?.id,
                currentUser,
              }),
            ])
            .apiVersion(apiVersion)
            .params({ type: type.name })
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType(type.name)
                .views([...previewPanes(S, type)])
            )
    )

/***
 * This returns a list item builder for a top-level list definition
 */
const listItemBuilder = (
  S: StructureBuilder,
  listItem: TopLevelListDefinition
) =>
  S.listItem()
    .title(listItem.title)
    .icon(listItem.icon)
    .child(
      S.list()
        .title(listItem.title)
        .items(
          listItem.typeDefs.map((type) =>
            type.type !== 'list' && singletonDocumentTypes.includes(type.name)
              ? singletonListItemBuilder(S, type)
              : type.type === 'list'
              ? listItemBuilder(S, type)
              : documentListItemBuilder(S, type)
          )
        )
    )

/***
 * This returns thepageStructure
 */
const pageStructure = (
  S: StructureBuilder,
  listItems: ListItem[],
  // TODO: replace deprecated type
  context: StructureResolverContext
) => {
  const currentUser = context?.currentUser

  const documentTypesStructure = listItems.map((listItem) => {
    if (listItem.type === 'list') {
      return listItemBuilder(S, listItem)
    }

    if (listItem.type === 'divider') {
      return S.divider()
    }

    return documentListItemBuilder(S, listItem, currentUser)
  })

  return S.list()
    .title(DESK_NAME)
    .items([
      navigationStructure(S, context.documentStore),
      S.divider(),
      ...documentTypesStructure,
      S.listItem()
        .id('tools')
        .title('Developer')
        .icon(() => '🛠️')
        .child(
          S.list()
            .id('tools')
            .title('Tools')
            .items([...S.documentTypeListItems()])
        ),
    ])
}

export default pageStructure
