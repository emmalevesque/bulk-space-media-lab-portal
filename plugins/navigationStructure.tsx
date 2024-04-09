import { AddIcon } from '@sanity/icons'
import EmojiIcon from 'components/Icon/Emoji'
import { groq } from 'next-sanity'
import { map } from 'rxjs/operators'
import { DocumentStore } from 'sanity'
import { StructureBuilder } from 'sanity/structure'
import category from 'schemas/documents/inventory/category'
import item from 'schemas/documents/inventory/item'
import tag from 'schemas/documents/inventory/tag'
import { previewPanes } from './deskStructure'
import { uuid } from '@sanity/uuid'

const typeIconMap = {
  category: category.icon,
  item: item.icon,
  tag: tag.icon,
}

export default function navigationStructure(
  S: StructureBuilder,
  documentStore: DocumentStore
) {
  // children fields fragment
  const childrenFieldsFragment = groq`
    _id,
    _type,
    name,
    useShortName,
    manufacturerDetails,
    variantNumber,
  `

  // create the recursive fragment from which all things flow 🌊
  const childrenFragment = (subChildrenFragment: string) => groq`
    "children": *[references(^._id) && !(_id in path("drafts.**"))][] {
       ${childrenFieldsFragment}
       ${subChildrenFragment}
    }
  `

  // create the filter for the main query to get the inventory structure
  const filter = groq`
  
  // get categories
  _type == "category" && 
  // top level categories
  !defined(parent) && !(_id in path("drafts.**"))`

  // build the main query
  const query = groq`
    *[
      ${filter}
    ]
    {
      ${childrenFieldsFragment} 
      // begin the recursion ➿
      ${childrenFragment(childrenFragment(childrenFragment('')))} 
      
    }
    // second projection to add count
    {
      ...,
      "childrenCount": count(children)
    } | order(childrenCount desc)
    `

  const options = { apiVersion: `2023-01-01`, tag: 'menuItems' }

  // create the recursive structure builder
  const recursiveStructureBuilder = (item: any) => {
    let itemName =
      item._type === 'category' || item.useShortName
        ? item.name
        : item.manufacturerDetails?.make && item.manufacturerDetails?.model
        ? `${item.manufacturerDetails?.make} ${item.manufacturerDetails?.model}`
        : 'Unnamed Item'

    itemName = `${
      item.variantNumber > 0 ? `(${item.variantNumber}) ` : ''
    }${itemName}`
    if (item._type === 'category') {
      // split the children ahead of time
      // to show the categories above the items

      const listItemChildCategories = item.children.filter((child: any) => {
        return child._type === 'category'
      })

      const listItemChildItems = item.children.filter((child: any) => {
        return child._type === 'item'
      })

      // prepare the lists by checking if there are children
      // and return them if they do otherwise return nothing (not null)

      const listItemChildCategoriesList =
        listItemChildCategories?.length > 0
          ? [
              S.divider(),
              ...listItemChildCategories.map((child: any) => {
                return recursiveStructureBuilder(child)
              }),
            ]
          : []

      const listItemChildItemsList =
        listItemChildItems?.length > 0
          ? [
              S.divider(),
              ...listItemChildItems.map((child: any) => {
                return recursiveStructureBuilder(child)
              }),
            ]
          : []

      return S.listItem()
        .title(itemName)
        .id(item._id)
        .icon(typeIconMap[item._type])
        .child(
          S.list()
            .title(itemName)
            .id(item._id)
            .items([
              S.listItem()
                .title(`New Item in ${item.name}`)
                .id(`new-item-in-${item._id}`)
                .icon(AddIcon)
                .child(
                  S.document()
                    .title(`New Item in ${item.name}`)
                    .schemaType('item')
                    .id(uuid())
                    .initialValueTemplate('item-child', {
                      parentId: item._id,
                      parentTitle: item.name,
                    })
                ),

              S.listItem()
                .title(`Edit ${item.name}`)
                .id(`${item._id}-edit`)
                .icon(() => <EmojiIcon>🔧</EmojiIcon>)
                .child(
                  S.defaultDocument({
                    documentId: item._id,
                    schemaType: item._type,
                  })
                ),
              ...listItemChildCategoriesList,
              ...listItemChildItemsList,
            ])
        )
    } else {
      return S.listItem()
        .title(itemName)
        .id(item._id)
        .icon(typeIconMap[item._type])
        .child(
          S.document()
            .title(`Edit ${itemName}`)
            .id(item._id)
            .schemaType(item._type)
            .views(previewPanes(S, { name: item._type }))
        )
    }
  }

  return S.listItem()
    .title('Inventory')
    .id('inventory')
    .icon(() => <EmojiIcon>🗄️</EmojiIcon>)
    .child(
      documentStore.listenQuery(query, {}, options).pipe(
        map((response: any) => {
          return S.list()
            .title('Manage Inventory')
            .id('manage-inventory')
            .items([
              ...response.map((item: any) => {
                return recursiveStructureBuilder(item)
              }),
            ])
        })
      )
    )
}
