import { ComponentType, ReactNode } from 'react'
import { DocumentDefinition } from 'sanity'
import { documentPreviewPanes, singletonDocumentTypes } from 'sanity.config'
import type {
  Divider,
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/desk'
import MenuPreviewPane from 'schemas/components/preview/MenuPreviewPane'
import parentChild from './parentCategory'
import category from 'schemas/documents/inventory/category'

// define new deskStructure list item type for legibility and organization
type TopLevelListDefinition = {
  type: 'list'
  title: string
  icon: JSX.Element | ComponentType | ReactNode
  typeDefs: DocumentDefinition[]
}

type ListItem = (TopLevelListDefinition | Divider | DocumentDefinition)[]

/***
 * This is the parent child taxonomy
 */

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
      singletonDocumentTypes.includes(type.name)
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
        : S.documentTypeList(type.name)
            .title(type.title || type.name)
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
            singletonDocumentTypes.includes(type.name)
              ? singletonListItemBuilder(S, type)
              : documentListItemBuilder(S, type)
          )
        )
    )

const getAllItemTypesFromDeskStructure = (listItems) => {
  return listItems
    .map((item) => {
      if (item.type === 'divider') return false
      if (item.type === 'list') {
        return getAllItemTypesFromDeskStructure(item.typeDefs)
      }

      return item.name
    })
    .filter(Boolean)
}

/***
 * This returns the deskStructure
 */
const deskStructure = (
  S: StructureBuilder,
  listItems: ListItem,
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
      parentChild(category.name, S, context.documentStore),
      S.divider(),
      ...documentTypesStructure,
    ])
}

export default deskStructure
