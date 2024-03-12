import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/Icon/Emoji'
import { defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: () => <EmojiIcon>⚙️</EmojiIcon>,
  fields: [
    {
      name: 'categories',
      description:
        'Top Level Categories. These will display in the portal in the order they are listed here.',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'category',
            },
          ],
        },
      ],
    },
    {
      name: 'navigationItems',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'page' }],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Navigation Menu',
        subtitle: 'Navigation Menu',
      }
    },
  },
})
