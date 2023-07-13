import QRCode from 'react-qr-code'
import { defineType, useFormValue } from 'sanity'
import { useCallback, useRef } from 'react'
import { Badge, Button, Card, Inline, Stack, Text, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'
import { BASE_URL } from 'lib/consts'
import slugify from 'slugify'

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

export const ItemSlugInputComponent = (props, context) => {
  const item = useFormValue(context) as TItem
  const { elementProps, onChange, value = '' } = props

  const itemFrontendUrl = `${BASE_URL}/inventory/${value?.current}`

  if (!value)
    return (
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Please generate a slug to see a QR code for this item
        </Text>
      </Stack>
    )

  const textInputRef = useRef(null)

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set({ ...value, current: nextValue }) : unset())
    },
    [onChange]
  )

  const handleGenerateSlug = () => {
    const nextValue = slugify(item?.name, { lower: true })
    console.log({ nextValue })

    onChange(nextValue ? set({ ...value, current: nextValue }) : unset())
  }

  return (
    <Stack space={2}>
      <Inline space={2}>
        <TextInput
          ref={textInputRef}
          {...elementProps}
          onChange={handleChange}
          value={value?.current}
        />
        <Button text="Generate" onClick={handleGenerateSlug} />
      </Inline>
      <Stack space={2} paddingY={2}>
        <Card>Item QR Code Generated from URL</Card>
        <Badge size={1} tone="positive">
          {itemFrontendUrl}
        </Badge>
      </Stack>
      <QRCode value={itemFrontendUrl} />
    </Stack>
  )
}

export const ItemPreviewPane = ({ document }) => {
  const { name, description, images, cost, stock, active } = document
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>{cost}</p>
      <p>{stock}</p>
      <p>{active}</p>
      {images?.map((image) => (
        <img src={image.asset.url} alt={name} />
      ))}
    </div>
  )
}

export default defineType({
  name: 'item',
  title: 'Inventory Item',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Item Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Item Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      components: {
        input: ItemSlugInputComponent,
      },
    },
    {
      name: 'sku',
      title: 'Item SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Item Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'cost',
      title: 'Item Price',
      type: 'number',
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
    // {
    //   name: 'brand',
    //   title: 'Item Brand',
    //   type: 'reference',
    //   to: [{ type: 'brand' }],
    //   validation: (Rule) => Rule.required(),
    // },
  ],
})
