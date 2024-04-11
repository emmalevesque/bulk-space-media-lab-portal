import { defineField, defineType } from 'sanity'
import checkout from 'schemas/documents/inventory/checkout'

export default defineType({
  ...checkout,
  name: 'user.checkout',
  title: 'User Checkout',
  type: 'document',
})
