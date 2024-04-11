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
        useShortName: true,
        categories: [{ _type: 'reference', _ref: parentId }],
      }
    },
  },
  {
    id: 'current-user-checkout',
    title: 'Checkout: Current User',
    schemaType: 'checkout',
    parameters: [
      {
        name: `userId`,
        title: `User ID`,
        type: `string`,
      },
      {
        name: `userDisplayName`,
        title: `User Display Name`,
        type: `string`,
      },
      {
        name: `currentUser`,
        title: `Current User`,
        type: `object`,
      },
    ],
    // This value will be passed-in from desk structure
    value: ({ userId }) => {
      return {
        staffMember: { _type: 'reference', _ref: `staff.${userId}` },
      }
    },
  },
]
