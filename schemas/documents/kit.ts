import { defineType } from 'sanity'

export default defineType({
  name: 'kit',
  title: 'Kit',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'inventoryItems',
      title: 'Inventory Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'inventoryItem' }] }],
    },
  ],
})
