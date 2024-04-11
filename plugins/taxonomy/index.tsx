import { definePlugin } from 'sanity'
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
