import { defineType } from 'sanity'

export default defineType({
  name: 'spotCheck',
  title: 'Spot Check',
  type: 'document',
  fields: [
    {
      name: 'checker',
      title: 'Checker',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'inventoryItems',
      title: 'Inventory Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'inventoryItem' }] }],
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
  ],
})
