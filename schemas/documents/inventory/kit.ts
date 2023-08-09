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
    {
      name: 'images',
      title: 'Item Image',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'category',
      title: 'Item Category',
      type: 'reference',

      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Item Tags',

      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'active',
      title: 'Item Active',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
  ],
})
