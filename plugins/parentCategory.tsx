import { DocumentStore, useDocumentStore, useFormValue } from 'sanity'
import { SanityDocument } from '@sanity/client'
import { StructureBuilder } from 'sanity/desk'
import { map } from 'rxjs/operators'
import category from 'schemas/documents/inventory/category'
import menu from 'schemas/singletons/menu'
import MenuPreviewPaneComponent from 'schemas/components/preview/MenuPreviewPane'
import { uuid } from '@sanity/uuid'
import { MenuIcon, ComposeIcon } from '@sanity/icons'
import { groq } from 'next-sanity'
import EmojiIcon from 'components/Icon/Emoji'

export default function parentChild(
  schemaType: string,
  S: StructureBuilder,
  documentStore: DocumentStore
) {
  const filter = `_type == "${schemaType}" && !defined(parent) && !(_id in path("drafts.**"))`
  const query = `*[${filter}]{ _id, title }`
  const options = { apiVersion: `2023-01-01` }

  function createChildList(
    S: StructureBuilder,
    schemaType: string,
    parent: SanityDocument,
    level: number
  ) {
    // Define the initial value template for this level
    const initialValueTemplate = S.initialValueTemplateItem(
      `category-level-${level}`,
      {
        parentId: parent._id,
      }
    )

    return S.listItem({
      id: parent._id,
      title: parent.title,
      icon: category.icon,
      schemaType,
      child: (childId) =>
        S.documentTypeList(schemaType)
          .title(`${parent.title}`)
          .showIcons(true)
          .id(parent._id)
          .filter(`_type == $schemaType && parent._ref == $parentId`)
          .params({ schemaType, parentId: parent._id })
          .canHandleIntent(
            (intentName, params) =>
              intentName === 'create' && params.template === 'category-child'
          )
          .initialValueTemplates([
            S.initialValueTemplateItem('category-child', {
              parentId: parent._id,
              title: 'test',
            }),
          ])
          .child((subChildId) => {
            // Query to find children of the current child (sub-children)
            const query = groq`{
                "subChildren": *[_type == "${schemaType}" && parent._ref == $subChildId && !(_id in path("drafts.**"))]{
                _id, 
                title 
              },
              "parentTitle": *[_id == $subChildId][0].title,
            }
            `
            return documentStore
              .listenQuery(query, { subChildId }, options)
              .pipe(
                map((response) =>
                  S.documentTypeList(schemaType)
                    .title(response.parentTitle)
                    .showIcons(true)
                    .id(parent._id)
                    .filter(
                      `_type == $schemaType && parent._ref == $documentId`
                    )
                    .params({
                      schemaType,
                      parentId: parent._id,
                      documentId: subChildId,
                    })
                    .canHandleIntent(
                      (intentName, params) =>
                        intentName === 'create' &&
                        params.template === 'category-child'
                    )
                    .initialValueTemplates([
                      S.initialValueTemplateItem('category-child', {
                        parentId: subChildId,
                      }),
                    ])
                )
              )
          }),
    })
  }

  return S.listItem()
    .title(menu.title || 'Navigation')
    .id(uuid())
    .icon(() => <EmojiIcon>🧭</EmojiIcon>)
    .child(() =>
      documentStore.listenQuery(query, {}, options).pipe(
        map((parents) =>
          S.list()
            .id(menu.name)
            .title(`${menu.title}` || 'Navigation')
            .menuItems([
              S.menuItem()
                .title('Add')
                .icon(ComposeIcon)
                .intent({ type: 'create', params: { type: schemaType } }),
            ])
            .items([
              // Create a List Item for each parent
              // To display all its child documents
              ...parents.map((parent: SanityDocument) =>
                createChildList(S, schemaType, parent, 2)
              ),
            ])
        )
      )
    )
}
