import { defineType } from 'sanity'

export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
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
      name: 'checkoutDate',
      title: 'Checkout Date',
      type: 'datetime',
    },
    {
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
    },
    {
      name: 'returned',
      title: 'Item Returned',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'spotChecked',
      title: 'Item Spot Checked',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
  ],
})
