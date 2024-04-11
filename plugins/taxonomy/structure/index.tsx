import { DocumentStore } from 'sanity'
import { StructureBuilder } from 'sanity/structure'

export const taxonomyStructure = (
  S: StructureBuilder,
  documentStore: DocumentStore
) => {
  const childCategoryList = ({
    child,
    categoryId,
  }: {
    child: any
    categoryId: string
  }) =>
    child.length
      ? S.documentTypeList('category')
          .filter(`parent._ref == $categoryId`)
          .params({ categoryId })
          .child(child)
      : S.documentTypeList('item')
          .filter(`$categoryId in categories[]._ref`)
          .params({ categoryId })

  return S.listItem()
    .id('taxonomy')
    .title('Taxonomy')
    .child(
      S.documentTypeList('category')
        .filter('_type == "category" && !defined(parent)')
        .child((categoryId) =>
          childCategoryList({
            child: (categoryId) =>
              childCategoryList({
                categoryId,
                child: (categoryId) =>
                  childCategoryList({ categoryId, child: null }),
              }),
            categoryId,
          })
        )
    )
}
