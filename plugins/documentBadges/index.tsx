import { CheckoutBadge } from 'schemas/documents/inventory/hooks/useInventory'

export default (prev, context) =>
  context.schemaType === 'checkout' ? [CheckoutBadge, ...prev] : prev
