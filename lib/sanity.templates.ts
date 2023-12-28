export const templates = [
  {
    id: 'category-child',
    title: 'Category: Child',
    schemaType: 'category',
    parameters: [{ name: `parentId`, title: `Parent ID`, type: `string` }],
    // This value will be passed-in from desk structure
    value: ({
      parentId,
      parentTitle,
    }: {
      parentId: string
      parentTitle: string
    }) => ({
      name: 'New Category in ' + parentTitle,
      parent: { _type: 'reference', _ref: parentId },
    }),
  },
  {
    id: 'item-child',
    title: 'Item: Child',
    schemaType: 'item',
    parameters: [
      { name: `parentId`, title: `Parent ID`, type: `string` },
      { name: `parentTitle`, title: `Parent Title`, type: `string` },
    ],
    // This value will be passed-in from desk structure
    value: ({
      parentId,
      parentTitle,
    }: {
      parentId: string
      parentTitle: string
    }) => {
      return {
        name: 'New Item in ' + parentTitle,
        categories: [{ _type: 'reference', _ref: parentId }],
      }
    },
  },
]
