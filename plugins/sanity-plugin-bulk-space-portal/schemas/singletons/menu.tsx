import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/global/Icon/Emoji'
import { defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Top Level Navigation',
  type: 'document',
  icon: () => <EmojiIcon>🧭</EmojiIcon>,
  fields: [
    {
      name: 'categories',
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
