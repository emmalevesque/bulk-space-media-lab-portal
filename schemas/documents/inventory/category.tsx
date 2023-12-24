import EmojiIcon from 'components/Icon/Emoji'
import { Id, Reference, defineField, defineType } from 'sanity'
import slugify from 'slugify'

export type Category = {
  _id: Id
  _type: 'category'
  name: string
  slug: string
  parent: Reference
  tags: {
    _type: 'tag'
    _ref: string
  }[]
  children?: Category[]
}

function asyncSlugify(input) {
  return slugify(input, { lower: true, strict: true })
}

// create a sanity schema type for a basic category in typescript
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: () => <EmojiIcon>🏷️</EmojiIcon>,
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {},
    },
    defineField({
      name: 'slug',
      title: 'Category Slug',
      type: 'slug',
      options: {
        source: 'name',
        slugify: asyncSlugify,
        maxLength: 96,
      },
    }),
    {
      name: 'tags',
      title: 'Category Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'parent.name',
    },
  },
})
