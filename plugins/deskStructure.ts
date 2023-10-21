import { ComponentType, ReactNode } from 'react'
import { DocumentDefinition } from 'sanity'
import {
  documentPreviewPanes,
  singletonDocumentTypes,
  typesWithCustomFilters,
} from 'sanity.config'
import type {
  Divider,
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/desk'
import MenuPreviewPane from 'schemas/components/preview/MenuPreviewPane'
import category from 'schemas/documents/inventory/category'
import navigationStructure from './navigationStructure'

type FilteredDocumentDefinition = DocumentDefinition & {
  filter: string
}

// define new deskStructure list item type for legibility and organization
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
    default:
      return `_type == $type`
  }
}

/***
 * This returns a list item builder for a singleton document type
 */
const singletonListItemBuilder = (
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
            .views([
              S.view.form().title('Edit'),
              S.view
                .component(MenuPreviewPane)
                .title('Preview')
                .options({ previewMode: true }),
            ])
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
  type: DocumentDefinition
): ListItemBuilder =>
  S.listItem()
    .title(type.title || type.name)
    .icon(type.icon)
    .child(
      createNewDocumentFromTopLevelTypes.hasOwnProperty(type.title || '')
        ? S.editor()
            .id(type.name)
            .schemaType(type.name)
            .documentId(type.name)
            .title(type.title || type.name)
            .views([S.view.form().title('Edit')])
        : singletonDocumentTypes.includes(type.name)
        ? Object.keys(documentPreviewPanes).includes(type.name)
          ? S.editor()
              .id(type.name)
              .schemaType(type.name)
              .documentId(type.name)
              .title(type.title || type.name)
              .views([
                S.view.form().title('Edit'),
                S.view
                  .component(documentPreviewPanes[type.name])
                  .title('Preview')
                  .options({ previewMode: true }),
              ])
          : S.editor()
              .id(type.name)
              .schemaType(type.name)
              .documentId(type.name)
              .title(type.title || type.name)
        : S.documentList()
            .title(type.title || type.name)
            .filter(
              typesWithCustomFilters.includes(type.name)
                ? getFilter(type.title || '')
                : `_type == $type`
            )
            .params({ type: type.name })
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType(type.name)
                .views([S.view.form()])
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
 * This returns the deskStructure
 */
const deskStructure = (
  S: StructureBuilder,
  listItems: ListItem[],
  context: StructureResolverContext
) => {
  const documentTypesStructure = listItems.map((listItem) => {
    if (listItem.type === 'list') {
      return listItemBuilder(S, listItem)
    }

    if (listItem.type === 'divider') {
      return S.divider()
    }

    return documentListItemBuilder(S, listItem)
  })

  return S.list()
    .title('Content')
    .items([
      navigationStructure(category.name, S, context.documentStore),
      S.divider(),
      ...documentTypesStructure,
    ])
}

export default deskStructure
