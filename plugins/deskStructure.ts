import { ComponentType, ReactNode } from 'react'
import { DocumentDefinition } from 'sanity'
import { singletonDocumentTypes } from 'sanity.config'
import type { Divider, ListItemBuilder, StructureBuilder } from 'sanity/desk'

// define new deskStructure list item type for legibility and organization
type TopLevelListDefinition = {
  type: 'list'
  title: string
  icon: JSX.Element | ComponentType | ReactNode
  typeDefs: DocumentDefinition[]
}

type ListItem = (TopLevelListDefinition | Divider | DocumentDefinition)[]

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
      S.document()
        .documentId(type.name)
        .schemaType(type.name)
        .views([S.view.form()])
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
        ? S.editor()
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

/***
 * This returns the deskStructure
 */
const deskStructure = (S: StructureBuilder, listItems: ListItem) => {
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
    .items([...documentTypesStructure])
}

export default deskStructure