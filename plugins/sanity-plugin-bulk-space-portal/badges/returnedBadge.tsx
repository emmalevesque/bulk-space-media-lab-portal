import { checkoutActions } from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useCheckout'

export function ReturnedBadge() {
  return {
    label: checkoutActions.RETURNED.label,
    color: checkoutActions.RETURNED.color,
    icon: checkoutActions.RETURNED.icon,
  }
}
