import EmojiIcon from 'components/Icon/Emoji'
import { groq } from 'next-sanity'
import { map } from 'rxjs/operators'
import { DocumentStore } from 'sanity'
import { StructureBuilder } from 'sanity/desk'

const typeIconMap = {
  category: () => <EmojiIcon>🏷️</EmojiIcon>,
  item: () => <EmojiIcon>🎒</EmojiIcon>,
  tag: () => <EmojiIcon>🏷️</EmojiIcon>,
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
      _id,
      _type,
      name,
      
      // begin the recursion ➿
      ${childrenFragment(childrenFragment(childrenFragment('')))} 
      
    }
    // second projection to add count
    {
      ...,
      "childrenCount": count(children)
    } | order(childrenCount desc)
    `

  const options = { apiVersion: `2023-01-01` }

  // create the recursive structure builder
  const recursiveStructureBuilder = (item: any) => {
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
        listItemChildCategories.length > 0
          ? [
              S.divider(),
              ...listItemChildCategories.map((child: any) => {
                return recursiveStructureBuilder(child)
              }),
            ]
          : []

      const listItemChildItemsList =
        listItemChildItems.length > 0
          ? [
              S.divider(),
              ...listItemChildItems.map((child: any) => {
                return recursiveStructureBuilder(child)
              }),
            ]
          : []

      return S.listItem()
        .title(item.name)
        .id(item._id)
        .icon(() => <EmojiIcon>🏷️</EmojiIcon>)
        .child(
          S.list()
            .title(item.name)
            .id(item._id)
            .items([
              S.listItem()
                .title(`Edit ${item.name}`)
                .id(`${item._id}-edit`)
                .icon(() => <EmojiIcon>🔧</EmojiIcon>)
                .child(
                  S.document()
                    .title(`Edit ${item.name}`)
                    .id(item._id)
                    .schemaType(item._type)
                ),
              ...listItemChildCategoriesList,
              ...listItemChildItemsList,
            ])
        )
    } else {
      return S.listItem()
        .title(item.name)
        .id(item._id)
        .icon(typeIconMap[item._type])
        .child(
          S.document()
            .title(`Edit ${item.name}`)
            .id(item._id)
            .schemaType(item._type)
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
          console.log({ response })

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
