// @eslint-disable-file
// @ts-nocheck
import QRCode from "react-qr-code";
import { defineType, useFormValue } from "sanity";
import { useCallback, useRef } from "react";
import {
  Badge,
  Button,
  Card,
  Inline,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
import { set, unset } from "sanity";
import { BASE_URL } from "lib/consts";
import slugify from "slugify";
import EmojiIcon from "components/Icon/Emoji";

export type TItem = {
  name: string;
  description: string;
  images: any[];
  cost: number;
  stock: number;
  active: boolean;
  slug: {
    current: string;
  };
};

export const ItemSlugInputComponent = (props, context) => {
  const item = useFormValue(context) as TItem;
  const { elementProps, onChange, value = "" } = props;

  const itemFrontendUrl = `${BASE_URL}/inventory/${value?.current}`;

  if (!value)
    return (
      <Stack space={2}>
        <Text size={1} weight="semibold">
          Please generate a slug to see a QR code for this item
        </Text>
      </Stack>
    );

  const textInputRef = useRef(null);

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set({ ...value, current: nextValue }) : unset());
    },
    [onChange]
  );

  const handleGenerateSlug = () => {
    const nextValue = slugify(item?.name, { lower: true });
    console.log({ nextValue });

    onChange(nextValue ? set({ ...value, current: nextValue }) : unset());
  };

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
  );
};

export default defineType({
  name: "item",
  title: "Inventory Item",
  type: "document",
  icon: () => <EmojiIcon>📸</EmojiIcon>,
  groups: [
    {
      name: "qrCode",
    },
    {
      name: "details",
      default: true,
    },
    {
      name: "images",
    },
    {
      name: "taxonomy",
    },
    {
      name: "stock",
    },
    {
      name: "condition",
    },
  ],
  fields: [
    {
      name: "easyName",
      title: "Easy Name",
      description:
        "Commonly used name for the item e.g. DSLR Camera, Cord, Adapter...",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required(),
    },
    {
      group: "details",
      name: "manufacturerDetails",
      title: "Manufacturer Details",
      type: "object",
      fields: [
        {
          name: "make",
          title: "Make",
          type: "string",
        },
        {
          name: "model",
          title: "Model",
          type: "string",
        },
      ],
    },
    {
      group: "details",
      name: "slug",
      title: "Item Slug",
      type: "slug",
      options: {
        source: "easyName",
        maxLength: 96,
      },
      components: {
        input: ItemSlugInputComponent,
      },
    },
    {
      group: "details",
      name: "sku",
      title: "Item SKU",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      group: "details",
      name: "description",
      title: "Item Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      group: "condition",
      name: "cost",
      title: "Item Price",
      type: "number",
    },
    {
      group: "images",
      name: "images",
      title: "Item Images",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      group: "taxonomy",
      name: "category",
      title: "Item Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      group: "taxonomy",
      name: "tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      title: "Item Tags",
    },
    {
      group: "condition",
      name: "stock",
      title: "Item Stock",
      type: "number",
    },
    {
      name: "active",
      title: "Item Active",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    },
    {
      group: "details",
      name: "productManualUrl",
      title: "Product Manual URL",
      description:
        "Product Manual URL (if applicable) OR revelvant and helpful links",
      type: "url",
    },
    {
      group: "condition",
      name: "condition",
      title: "Condition",
      type: "string",
      options: {
        list: ["New", "Good", "Fair", "Poor"],
      },
    },
  ],
  preview: {
    select: {
      subtitle: "easyName",
      manufacturerMake: "manufacturerDetails.make",
      manufacturerModel: "manufacturerDetails.model",
      media: "images.0",
      category: "category.title",
      parentCategory: "category.parent.title",
    },
    prepare: ({
      media,
      category,
      parentCategory,
      subtitle,
      manufacturerMake,
      manufacturerModel,
    }) => {
      return {
        subtitle: `${parentCategory ? `${parentCategory} > ` : ""}${
          category || ""
        }`,
        title:
          manufacturerMake && manufacturerModel
            ? `${manufacturerMake} ${manufacturerModel}`
            : subtitle,
        media: media || undefined,
      };
    },
  },
});