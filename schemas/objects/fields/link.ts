import { defineType } from 'sanity'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
  ],
})
