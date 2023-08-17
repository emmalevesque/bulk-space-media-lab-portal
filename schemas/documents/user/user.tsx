import EmojiIcon from 'components/Icon/Emoji'
import { defineField, defineType } from 'sanity'

// TODO: move contact fields into user
export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: () => <EmojiIcon>👤</EmojiIcon>,
  fields: [
    defineField({
      type: 'string',
      name: 'name',
      title: 'Name',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
      ],
      options: {
        columns: 2,
      },
    }),
  ],
  preview: {
    select: {
      name: 'name',
      contact: 'contact',
    },
    prepare({ name, contact }) {
      return {
        title: name ? `${name}` : 'No user name contact yet...',
        subtitle: contact?.email,
      }
    },
  },
})
