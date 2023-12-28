import { defineField, defineType } from 'sanity'

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
  fieldsets: [
    {
      name: 'stock',
      title: 'Manage Stock & Variant Number',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      name: 'isVariant',
      title: 'Is this a variant of another inventory item?',
      description:
        'As a variant the maximum number of stock for this item will be 1. (Commonly used for more valueable items to track each item individually)',
      initialValue: false,
      type: 'boolean',
      fieldset: 'stock',
      group: 'metadata',
    },
    defineField({
      name: 'variantNumber',
      title: 'Variant Number',
      description: 'This number is automatically set when creating a variant',
      fieldset: 'stock',
      group: 'metadata',
      type: 'number',
      initialValue: 1,
      hidden: ({ parent }) => !parent?.isVariant,
      readOnly: ({ parent }) => !parent?.isVariant,
    }),
    {
      name: 'stock',
      fieldset: 'stock',
      title: 'Stock Quanity',
      type: 'number',
      group: 'metadata',
      initialValue: 1,
      readOnly: ({ parent }) => parent?.isVariant,
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
      group: 'details',
      name: 'serialNumber',
      title: 'Serial Number',
      type: 'string',
    },
    {
      group: 'details',
      name: 'description',
      title: 'Item Description',
      type: 'description',
    },
    {
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
      manufacturerDetails: 'manufacturerDetails',
      manufacturerMake: 'manufacturerDetails.make',
      manufacturerModel: 'manufacturerDetails.model',
      media: 'images.0',
      parentCategory: 'categories.0.parent.name',
      firstCategory: 'categories.0.name',
      secondCategory: 'categories.1.name',
      stock: 'stock',
      variantNumber: 'variantNumber',
    },
    prepare: ({
      parentCategory,
      name,
      manufacturerDetails,
      manufacturerMake,
      manufacturerModel,
      stock,
      firstCategory,
      secondCategory,
      variantNumber,
      ...rest
    }) => {
      const manufacturerName =
        manufacturerDetails?.make && manufacturerDetails?.model
          ? `${manufacturerMake} ${manufacturerModel}`
          : name
      const parentCategoryName = parentCategory
        ? `${parentCategory} > ${firstCategory}`
        : firstCategory
      const category = parentCategoryName || firstCategory
      const subtitle = `${manufacturerName} ${category}`

      const variantNumberString = variantNumber > 1 ? ` (${variantNumber})` : ''

      return {
        ...rest,
        subtitle: `${parentCategory ? `${parentCategory} > ` : ''}${
          firstCategory || ''
        }`,
        title: `${manufacturerName}${variantNumberString}`,
        // TODO: replace this with any uploaded images
        // TODO: potentially add a little dot icon to indicate stock
        media: <StatusIcon stock={stock} />,
        stock: stock,
        secondCategory,
        firstCategory,
        parentCategory,
      }
    },
  },
})
