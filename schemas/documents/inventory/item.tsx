import { defineType } from 'sanity'

import EmojiIcon from 'components/Icon/Emoji'
import { CategoryInputComponent } from './components/Category/CategoryInput'
import StatusIcon from './components/StatusIcon'
import slugify from 'slugify'
import ItemPreviewComponent from './components/Item/ItemPreviewComponent'
import { Box, Card, Grid, Inline, Text } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'

export type ItemType = SanityDocument & {
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
      name: 'details',
      default: true,
    },
    {
      name: 'images',
    },
    {
      name: 'description',
    },
    {
      name: 'taxonomy',
    },
    {
      name: 'condition',
    },
  ],
  fields: [
    {
      name: 'stock',
      title: 'Stock Quanity',
      type: 'number',
      group: 'details',
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
      name: 'condition',
      title: 'Condition',
      type: 'object',
      group: 'condition',
      fields: [
        {
          name: 'report',
          title: 'Condition Report',
          type: 'array',
          of: [{ type: 'block' }],
        },
        {
          name: 'rating',
          title: 'Condition Rating',
          type: 'number',
          description: '1 = Poor, 10 = Excellent',
          initialValue: 10,
          validation: (Rule) => [Rule.min(1), Rule.max(10)],
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
      group: 'description',
      name: 'description',
      title: 'Item Description',
      type: 'text',
    },
    {
      hidden: ({ parent }) => !parent?.showMoreDetails,
      name: 'replacementCost',
      title: 'Replacement Cost',
      group: 'details',
      description: 'The cost to replace this item',
      type: 'number',
      components: {
        input: (props) => {
          return (
            <Box>
              <Grid columns={2}>
                <Inline>
                  <Card padding={3} tone="positive">
                    <Text size={2}>$</Text>
                  </Card>
                  {props?.renderDefault(props)}
                </Inline>
              </Grid>
            </Box>
          )
        },
      },
    },
    {
      group: 'details',
      hidden: ({ parent }) => !parent?.showMoreDetails,
      name: 'productManualUrl',
      title: 'Product Manual URL',
      description:
        'Product Manual URL (if applicable) OR revelvant and helpful links',
      type: 'url',
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
      name: 'categories',
      title: 'Item Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      components: {
        input: CategoryInputComponent,
      },
    },
    // {
    //   group: 'taxonomy',
    //   name: 'tags',
    //   type: 'array',
    //   of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    //   title: 'Item Tags',
    // },
  ],
  preview: {
    select: {
      name: 'name',
      manufacturerMake: 'manufacturerDetails.make',
      manufacturerModel: 'manufacturerDetails.model',
      media: 'images.0',
      category: 'categories.0.title',
      parentCategory: 'categories.0.parent.title',
      firstCategory: 'categories.0.title',
      secondCategory: 'categories.1.title',
      stock: 'stock',
    },
    prepare: ({
      parentCategory,
      name,
      manufacturerMake,
      manufacturerModel,
      stock,
      firstCategory,
      secondCategory,
      ...rest
    }) => {
      return {
        ...rest,
        subtitle: `${parentCategory ? `${parentCategory} > ` : ''}${
          firstCategory || ''
        }`,
        title:
          manufacturerMake && manufacturerModel
            ? `${manufacturerMake} ${manufacturerModel} ${name}`
            : name,
        media: <StatusIcon stock={stock} />,
        stock: stock,
        secondCategory,
        firstCategory,
        parentCategory,
      }
    },
  },
})
