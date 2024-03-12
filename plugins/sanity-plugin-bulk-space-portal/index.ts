import { definePlugin } from 'sanity'
import documentActions from './documentActions'
import documentBadges from './documentBadges'
import { templates } from 'lib/sanity.templates'
import { schema } from 'schemas/schema'
import { tools } from './tools'

export const bulkSpacePortal = definePlugin({
  name: 'sanity-plugin-bulk-space-portal',
  document: {
    actions: documentActions,
    badges: documentBadges,
  },
  tools,
  schema: {
    types: schema,
    templates,
  },
})

export { deskStructure } from './deskStructure'
export { navigationStructure } from './navigationStructure'
