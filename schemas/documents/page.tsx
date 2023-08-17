import { defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',

  groups: [
    {
      name: 'metadata',
    },

    {
      name: 'content',
      default: true,
    },
    {
      name: 'seo',
    },
    {
      name: 'subpages',
    },
    {
      name: 'settings',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'metadata',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'metadata',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      group: 'content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subpages',
      title: 'Subpages',
      group: 'subpages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'page' }] }],
    },
    {
      name: 'seo',
      title: 'SEO',
      group: 'seo',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
      ],
    },
  ],
})
