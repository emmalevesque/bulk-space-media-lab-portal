import { defineType, useClient } from 'sanity'

import EmojiIcon from 'components/Icon/Emoji'
import { CategoryInputComponent } from './components/CategoryInput'
import { groq } from 'next-sanity'
import StatusIcon from './components/StatusIcon'

export type TItem = {
  name: string
  description: string
  images: any[]
  cost: number
  stock: number
  active: boolean
  slug: {
    current: string
  }
}

export default defineType({
  name: 'item',
  title: 'Inventory Item',
  type: 'document',
  icon: () => <EmojiIcon>📸</EmojiIcon>,
  groups: [
    {
      name: 'qrCode',
    },
    {
      name: 'details',
      default: true,
    },
    {
      name: 'images',
    },
    {
      name: 'taxonomy',
    },
    {
      name: 'stock',
    },
    {
      name: 'miscellaneous',
    },
  ],
  fields: [
    {
      group: 'qrCode',
      name: 'qrCode',
      title: 'QR Code',
      type: 'qrCode',
    },
    {
      name: 'name',
      title: 'Short Name',
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
          name: 'make',
          title: 'Make',
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
    },
    {
      group: 'taxonomy',
      name: 'categories',
      title: 'Item Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      components: {
        input: CategoryInputComponent,
      },
    },
    {
      group: 'taxonomy',
      name: 'tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      title: 'Item Tags',
    },
    {
      name: 'stock',
      title: 'Stock Quanity',
      type: 'number',
      group: 'stock',
      initialValue: 1,
    },
    {
      group: 'miscellaneous',
      name: 'productManualUrl',
      title: 'Product Manual URL',
      description:
        'Product Manual URL (if applicable) OR revelvant and helpful links',
      type: 'url',
    },
  ],
  preview: {
    select: {
      subtitle: 'easyName',
      manufacturerMake: 'manufacturerDetails.make',
      manufacturerModel: 'manufacturerDetails.model',
      media: 'images.0',
      category: 'category.title',
      parentCategory: 'category.parent.title',
      stock: 'stock',
    },
    prepare: ({
      media,
      category,
      parentCategory,
      subtitle,
      manufacturerMake,
      manufacturerModel,
      stock,
    }) => {
      return {
        subtitle: `${parentCategory ? `${parentCategory} > ` : ''}${
          category || ''
        }`,
        title:
          manufacturerMake && manufacturerModel
            ? `${manufacturerMake} ${manufacturerModel}`
            : subtitle,
        media: <StatusIcon stock={stock} />,
      }
    },
  },
})
