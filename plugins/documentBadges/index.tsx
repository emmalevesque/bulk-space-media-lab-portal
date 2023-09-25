import { CheckoutBadge } from './checkoutBadges'

export default (prev, context) =>
  context.schemaType === 'checkout' ? [CheckoutBadge, ...prev] : prev
