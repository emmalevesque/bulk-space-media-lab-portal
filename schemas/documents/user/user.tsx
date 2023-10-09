import EmojiIcon from 'components/Icon/Emoji'
import { defineField, defineType } from 'sanity'
import QrCode from '../inventory/components/QrCode'

// TODO: Add QR Code for users
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
      name: 'slug',
      title: 'Internal Slug',
      description:
        'This is an internal name used by the system to identify this user.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
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
