import { CheckoutBadge } from './CheckoutBadge'
import { ItemBadge } from './ItemBadge'
export default (prev, context) =>
  context.schemaType === 'checkout'
    ? [CheckoutBadge]
    : context.schemaType === 'item'
    ? [ItemBadge]
    : prev
