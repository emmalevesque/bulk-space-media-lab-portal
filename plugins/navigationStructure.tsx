import EmojiIcon from 'components/Icon/Emoji'
import { groq } from 'next-sanity'
import { map } from 'rxjs/operators'
import { DocumentStore } from 'sanity'
import { StructureBuilder } from 'sanity/desk'

const typeIconMap = {
  category: () => <EmojiIcon>🏷️</EmojiIcon>,
  product: () => <EmojiIcon>🎒</EmojiIcon>,
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
    return S.listItem()
      .title(item.name)
      .id(item._id)
      .icon(typeIconMap[item._type])
      .child(
        S.list()
          .title(item.name)
          .id(item._id)
          .items([
            S.listItem()
              .title(`Edit ${item.name}`)
              .id(`${item._id}-edit`)
              .icon(() => <EmojiIcon>📝</EmojiIcon>)
              .child(
                S.document()
                  .title(`Edit ${item.name}`)
                  .id(item._id)
                  .schemaType(item._type)
              ),
            S.divider(),
            ...item.children.map((child) => {
              return recursiveStructureBuilder(child)
            }),
          ])
      )
  }

  return S.listItem()
    .title('Manage Inventory')
    .id('manage-inventory')
    .icon(() => <EmojiIcon>🎒</EmojiIcon>)
    .child(
      documentStore.listenQuery(query, {}, options).pipe(
        map((response: any) => {
          // create separate lists for items and categories

          const categories = response.filter(
            (item) => item._type === 'category'
          )

          return S.list()
            .title('Manage Inventory')
            .items(
              categories.map((item) => {
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
                          .icon(() => <EmojiIcon>📝</EmojiIcon>)
                          .child(
                            S.document()
                              .title(`Edit ${item.name}`)
                              .id(item._id)
                              .schemaType(item._type)
                          ),
                        S.divider(),
                        ...item.children.map((child) => {
                          if (child._type === 'category') {
                            return S.listItem()
                              .title(child.name)
                              .id(child._id)
                              .icon(() => <EmojiIcon>🏷️</EmojiIcon>)
                              .child(
                                S.list()
                                  .title(child.name)
                                  .id(child._id)
                                  .items(
                                    child.children.map((subChild) => {
                                      return S.listItem()
                                        .title(subChild.name)
                                        .id(subChild._id)
                                        .icon(typeIconMap[subChild._type])
                                        .child(
                                          S.list()
                                            .title(subChild.name)
                                            .id(subChild._id)
                                            .items(
                                              subChild.children?.map(
                                                (subSubChild) => {
                                                  console.log({ subChild })

                                                  return S.listItem()
                                                    .title(subSubChild.name)
                                                    .id(subSubChild._id)
                                                    .icon(
                                                      typeIconMap[
                                                        subSubChild._type
                                                      ]
                                                    )
                                                    .child(
                                                      S.document()
                                                        .id(subSubChild._id)
                                                        .schemaType(
                                                          subSubChild._type
                                                        )
                                                    )
                                                }
                                              )
                                            )
                                        )
                                    })
                                  )
                              )
                          } else {
                            return S.listItem()
                              .title(child.name)
                              .id(child._id)
                              .child(S.list().title(child.name).id(child._id))
                          }
                        }),
                      ])
                  )
              })
            )
        })
      )
    )
}
