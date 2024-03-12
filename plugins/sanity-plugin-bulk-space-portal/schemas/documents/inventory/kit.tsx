import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/global/Icon/Emoji'
import { defineType } from 'sanity'
import { CategoryInputComponent } from './components/Category/CategoryInput'

export default defineType({
  name: 'kit',
  title: 'Kit',
  type: 'document',
  icon: () => <EmojiIcon>📦</EmojiIcon>,
  groups: [
    {
      name: 'details',
      default: true,
    },
    {
      name: 'images',
    },
    {
      name: 'taxonomy',
    },
  ],
  fields: [
    {
      group: 'details',
      name: 'name',
      title: 'Kit name',
      type: 'string',
    },
    {
      group: 'details',
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      group: 'details',
      name: 'items',
      title: 'Inventory Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'item' }] }],
    },
    {
      group: 'images',
      name: 'images',
      title: 'Item Image',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      group: 'taxonomy',
      name: 'categories',
      title: 'Item Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      components: {
        input: CategoryInputComponent,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      group: 'taxonomy',
      name: 'tags',
      title: 'Item Tags',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    },
  ],
})
