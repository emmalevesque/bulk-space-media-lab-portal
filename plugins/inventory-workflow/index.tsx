import { definePlugin } from 'sanity'
import itemVariant from './schema/item.variant'
import userCheckout from './schema/user.checkout'
import actions from './actions'

export default definePlugin({
  name: 'inventory-workflow',
  document: {
    actions,
  },
  schema: {
    types: [itemVariant, userCheckout],
  },
})
