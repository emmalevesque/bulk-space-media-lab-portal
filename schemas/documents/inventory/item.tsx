import { defineType } from 'sanity'

import EmojiIcon from 'components/Icon/Emoji'
import { CategoryInputComponent } from './components/Category/CategoryInput'
import StatusIcon from './components/StatusIcon'
import slugify from 'slugify'
import ItemPreviewComponent from './components/Item/ItemPreviewComponent'

export type ItemType = {
  name: string
  manufacturerDetails: {
    make: string
    model: string
  }
  slug: {
    current: string
  }
  showMoreDetails: boolean
  sku: string
  description: string
  images: {
    asset: {
      _ref: string
    }
  }[]
  category: {
    title: string
    parent: {
      title: string
    }
  }
  stock: number
  productManualUrl: string
}

export default defineType({
  name: 'item',
  title: 'Inventory Item',
  type: 'document',
  icon: () => <EmojiIcon>📸</EmojiIcon>,
  components: {
    preview: ItemPreviewComponent,
  },
  groups: [
    {
      name: 'overview',
      default: true,
    },
    {
      name: 'details',
    },
    {
      name: 'images',
    },
    {
      name: 'taxonomy',
    },

    {
      name: 'miscellaneous',
    },
  ],
  fields: [
    {
      name: 'stock',
      title: 'Stock Quanity',
      type: 'number',
      group: 'overview',
      initialValue: 1,
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
        source: 'manufacturerDetails',
        slugify: (input: { make: string; model: string }) =>
          slugify(`${input.make} ${input.model}`, {
            lower: true,
            strict: true,
          }),
        maxLength: 96,
      },
    },
    {
      name: 'showMoreDetails',
      title: 'Show More Details',
      type: 'boolean',
      group: 'details',
    },
    {
      hidden: ({ parent }) => !parent?.showMoreDetails,
      group: 'details',
      name: 'sku',
      title: 'Item SKU',
      type: 'string',
    },
    {
      hidden: ({ parent }) => !parent?.showMoreDetails,
      group: 'details',
      name: 'description',
      title: 'Item Description',
      type: 'text',
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
      subtitle: 'name',
      manufacturerMake: 'manufacturerDetails.make',
      manufacturerModel: 'manufacturerDetails.model',
      media: 'images.0',
      category: 'category.title',
      parentCategory: 'category.parent.title',
      stock: 'stock',
    },
    prepare: ({
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
        stock,
        parentCategory,
      }
    },
  },
})
