import { defineType } from 'sanity'

export default defineType({
  name: 'inventoryItem',
  title: 'Inventory Item',
  type: 'document',
  groups: [
    {
      title: 'Details',
      name: 'details',
    },
    {
      title: 'Item Images',
      name: 'images',
    },
    {
      title: 'Taxonomy',
      name: 'taxonomy',
    },
    {
      title: 'Item Stock',
      name: 'stock',
    },
    {
      title: 'Cost and Condition',
      name: 'condition',
    },
  ],
  fields: [
    {
      name: 'easyName',
      title: 'Easy Name',
      description:
        'Commonly used name for the item e.g. DSLR Camera, Cord, Adapter...',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'details',
      name: 'manufacturerDetails',
      title: 'Manufacturer Details',
      type: 'object',
      fields: [
        {
          name: 'manufacturer',
          title: 'Manufacturer',
          type: 'string',
        },
        {
          name: 'model',
          title: 'Model',
          type: 'string',
        },
      ],
    },
    {
      group: 'details',
      name: 'slug',
      title: 'Item Slug',
      type: 'slug',
      options: {
        source: 'easyName',
        maxLength: 96,
      },
    },
    {
      group: 'details',
      name: 'sku',
      title: 'Item SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'details',
      name: 'description',
      title: 'Item Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'condition',
      name: 'cost',
      title: 'Item Price',
      type: 'number',
    },
    {
      group: 'images',
      name: 'images',
      title: 'Item Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      group: 'taxonomy',
      name: 'category',
      title: 'Item Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'taxonomy',
      name: 'tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      title: 'Item Tags',
    },
    {
      group: 'condition',
      name: 'stock',
      title: 'Item Stock',
      type: 'number',
    },
    {
      name: 'active',
      title: 'Item Active',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'details',
      name: 'productManualUrl',
      title: 'Product Manual URL',
      description:
        'Product Manual URL (if applicable) OR revelvant and helpful links',
      type: 'url',
    },
    {
      group: 'condition',
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: ['New', 'Good', 'Fair', 'Poor'],
      },
    },
  ],
})
