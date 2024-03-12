import { checkoutActions } from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useCheckout'

export function itemsNeededBadge() {
  return {
    label: checkoutActions.ITEMS_NEEDED.label,
    color: checkoutActions.ITEMS_NEEDED.color,
  }
}
