import { defineType } from 'sanity'

export default defineType({
  name: 'reservation',
  title: 'Reservation',
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
      name: 'reservationDate',
      title: 'Reservation Date',
      type: 'datetime',
    },
    {
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
    },
  ],
})
