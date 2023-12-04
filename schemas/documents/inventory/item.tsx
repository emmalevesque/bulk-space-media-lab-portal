import { defineType } from 'sanity'

import { Box, Card, Grid, Inline, Text } from '@sanity/ui'
import EmojiIcon from 'components/Icon/Emoji'
import { SanityDocument } from 'next-sanity'
import conditionReport from 'schemas/objects/conditionReport'
import slugify from 'slugify'
import { CategoryInputComponent } from './components/Category/CategoryInput'
import ItemPreviewComponent from './components/Item/ItemPreviewComponent'
import StatusIcon from './components/StatusIcon'

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
      name: 'metadata',
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
      name: 'condition',
    },
  ],
  fields: [
    {
      name: 'stock',
      title: 'Stock Quanity',
      type: 'number',
      group: 'metadata',
      initialValue: 1,
    },
    {
      name: 'name',
      title: 'Short Name',
      description:
        'Commonly used name for the item e.g. DSLR Camera, Cord, Adapter...',
      type: 'string',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'metadata',
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
      type: 'array',
      of: [{ type: conditionReport.name }],
      group: 'condition',
    },
    {
      group: 'metadata',
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
      name: 'serialNumber',
      title: 'Serial Number',
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
