import { Flex, Box, Card } from "@sanity/ui";
import { groq } from "next-sanity";
import { Id, PreviewProps, Reference, defineType } from "sanity";

type Category = {
  _id: Id;
  _type: "category";
  title: string;
  slug: string;
  parent: Reference;
  tags: {
    _type: "tag";
    _ref: string;
  }[];
};

type CategoryPreviewProps = PreviewProps & Category;

// create a sanity schema type for a basic category in typescript
export default defineType({
  name: "category",
  title: "Category",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Category Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    // TODO: determine whether this structure is better
    {
      name: "children",
      title: "Children Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "tags",
      title: "Category Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare: (selection) => {
      return {
        ...selection,
      };
    },
  },
});
