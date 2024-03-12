import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/Icon/Emoji'
import { defineType } from 'sanity'

export default defineType({
  name: 'check',
  title: 'Spot Check',
  type: 'document',
  icon: () => <EmojiIcon>🔎</EmojiIcon>,
  fields: [
    // TODO: change 'user' to 'member' and create 'staff' type
    {
      name: 'staff',
      title: 'Staff',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'member',
      title: 'Member',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'items',
      title: 'Inventory Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'item' }] }],
    },
    {
      name: 'checkDate',
      title: 'Check Date',
      type: 'datetime',
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
    },
    {
      // TODO: this boolean enables/disables further checkouts on item/kit
      name: 'isComplete',
      title: 'Is Complete?',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
  ],
})
