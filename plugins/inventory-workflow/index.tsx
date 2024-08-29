import { DocumentBadgeComponent, definePlugin } from 'sanity'
import itemVariant from './schema/item.variant'
import userCheckout from './schema/user.checkout'
import actions from './actions'
import { CheckoutBadge } from './badges/CheckoutBadge'
import { ItemBadge } from './badges/ItemBadge'
// import { ColorBadge } from './badges/ColorBadge'

export default definePlugin({
  name: 'inventory-workflow',
  document: {
    actions,
    badges: (prev, context) =>
      context.schemaType === 'checkout'
        ? [CheckoutBadge as DocumentBadgeComponent]
        : context.schemaType === 'item'
        ? [
            ItemBadge as DocumentBadgeComponent,
            // TODO: fix this
            // ColorBadge as DocumentBadgeComponent,
          ].filter(Boolean)
        : prev,
  },
  schema: {
    types: [itemVariant, userCheckout],
  },
})
