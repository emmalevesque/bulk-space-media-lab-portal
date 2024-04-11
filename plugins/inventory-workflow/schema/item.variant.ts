import { defineType } from 'sanity'
import item from 'schemas/documents/inventory/item'

export default defineType({
  ...item,
  name: 'item.variant',
  title: 'Item Variant',
  type: 'document',
  fields: [
    {
      name: 'serialNumber',
      title: 'Serial Number',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'item',
      title: 'Item',
      type: 'reference',
      to: [{ type: 'item' }],
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
  ],
})
