import { definePlugin } from 'sanity'
import category from 'schemas/documents/inventory/category'
import { templates } from './templates'

export default definePlugin({
  name: 'taxonomy',
  schema: {
    templates,
    types: [
      // category
    ],
  },
})
