import { defineField, defineType } from 'sanity'

import { Box, Card, Grid, Inline, Text } from '@sanity/ui'
import EmojiIcon from 'components/global/Icon/Emoji'
import conditionReport from 'schemas/objects/conditionReport'
import slugify from 'slugify'
import { TaxonomyComponent } from 'plugins/taxonomy/components/TaxonomyComponent'
import ItemPreviewComponent from '../../../plugins/inventory-workflow/components/preview/ItemPreviewComponent'
import { getCheckoutStatusProps } from '../../../plugins/inventory-workflow/hooks/hooks/useCheckout'
import { ItemType } from 'plugins/inventory-workflow/types'
import { urlForImage } from 'lib/sanity.image'

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
      name: 'options',
      title: 'Options',
      options: {
        collapsible: true,
        collapsed: false,
        columns: 2,
      },
    },
    {
      name: 'stock',
      title: 'Manage Stock & Variant Number',
      options: {
        columns: 1,
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      description: 'Short Name is used in the preview and in the slug',
      name: 'name',
      title: 'Short Name',
      type: 'string',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'metadata',
      name: 'manufacturerDetails',
      title: 'Manufacturer Details',
      options: {
        columns: 2,
      },
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
    // TODO: add custom input component to ensure that stock
    // is set 1 when isVariant is true
    defineField({
      name: 'isVariant',
      title: 'Is this a variant of another inventory item?',
      initialValue: false,
      type: 'boolean',
      fieldset: 'stock',
      group: 'metadata',
    }),
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
    defineField({
      name: 'variants',
      hidden: ({ parent }) => parent?.isVariant,
      title: 'Variants',
      type: 'array',
      of: [{ weak: true, type: 'reference', to: [{ type: 'item' }] }],
      fieldset: 'stock',
      group: 'metadata',
      // hidden: ({  document }) => !document?.variants,
    }),
    {
      fieldset: 'options',
      name: 'useShortName',
      title: 'Use Short Name?',
      type: 'boolean',
      group: 'metadata',
    },
    {
      group: 'metadata',
      name: 'colorTag',
      title: 'Color Tag',
      type: 'reference',
      to: [{ type: 'colorTag' }],
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
        slugify: (input: { make: string; model: string }, _, context) => {
          const parent = context?.parent as ItemType

          if (!input.make || !input.model) {
            return slugify(
              `${input.make} ${input.model}${
                parent?.variantNumber > 0 ? ` ${parent?.variantNumber}` : ''
              }`,
              {
                lower: true,
                strict: true,
              }
            )
          }
        },
        maxLength: 96,
      },
    },
    {
      group: 'details',
      name: 'serialNumber',
      title: 'Serial Number',
      type: 'string',
      description: 'Serial Number (if applicable)',
      validation: (Rule) =>
        Rule.required().warning(
          'Adding a serial number is recommended for tracking purposes.'
        ),
    },
    {
      group: 'details',
      name: 'description',
      title: 'Item Description',
      type: 'description',
    },
    {
      name: 'purchaseYear',
      title: 'Purchase Year',
      description: 'Used for insurance purposes',
      type: 'number',
      validation: (Rule) => Rule.min(2022).max(2999),
      group: 'details',
      initialValue: () => new Date().getFullYear(),
    },
    {
      name: 'replacementCost',
      title: 'Replacement Cost',
      group: 'details',
      description: 'Market Value',
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
        input: TaxonomyComponent,
      },
    },
  ],
  orderings: [
    {
      name: 'nameAsc',
      title: 'Name A-Z',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      name: 'nameDesc',
      title: 'Name Z-A',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      name: 'stockAsc',
      title: 'Stock Low-High',
      by: [{ field: 'stock', direction: 'asc' }],
    },
    {
      name: 'stockDesc',
      title: 'Stock High-Low',
      by: [{ field: 'stock', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      manufacturerDetails: 'manufacturerDetails',
      manufacturerMake: 'manufacturerDetails.make',
      manufacturerModel: 'manufacturerDetails.model',
      media: 'images.0.asset',
      parentCategory: 'categories.0.parent.name',
      firstCategory: 'categories.0.name',
      secondCategory: 'categories.1.name',
      stock: 'stock',
      variantNumber: 'variantNumber',
      useShortName: 'useShortName',
      variants: 'variants',
      isVariant: 'isVariant',
      colorTag: 'colorTag.color.value',
    },
    prepare: ({
      variants,
      isVariant,
      parentCategory,
      name,
      manufacturerDetails,
      manufacturerMake,
      manufacturerModel,
      stock,
      firstCategory,
      secondCategory,
      variantNumber,
      media,
      colorTag,
      useShortName,
      ...rest
    }) => {
      const manufacturerName = useShortName
        ? name
        : manufacturerDetails?.make && manufacturerDetails?.model
        ? `${manufacturerMake} ${manufacturerModel}`
        : 'Untitled'

      const parentCategoryName = parentCategory
        ? `${parentCategory} > ${firstCategory}`
        : firstCategory
      const category = parentCategoryName || firstCategory

      const subtitle = `${manufacturerName} ${category}`

      const variantNumberString =
        isVariant ||
        (!isVariant &&
          Array.isArray(variants) &&
          variants.length > 0 &&
          variantNumber > 0)
          ? `(${variantNumber}) `
          : ''

      const statusIcon =
        stock > 0
          ? getCheckoutStatusProps('AVAILABLE').emoji
          : getCheckoutStatusProps('NO_STOCK').emoji

      return {
        ...rest,
        subtitle: `${parentCategory ? `${parentCategory} > ` : ''}${
          firstCategory || subtitle
        }`,
        title: `${variantNumberString}${manufacturerName}`,
        // TODO: replace this with any uploaded images
        // TODO: potentially add a little dot icon to indicate stock
        stock: stock,
        media: colorTag
          ? () => (
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              >
                {media && (
                  <img
                    src={urlForImage(media)
                      .width(200)
                      .height(200)
                      .fit('crop')
                      .url()}
                  />
                )}
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '100%',
                    backgroundColor: colorTag,
                  }}
                  className=" absolute bottom-2 left-2"
                ></span>
              </span>
            )
          : media,
        secondCategory,
        firstCategory,
        parentCategory,
      }
    },
  },
})
