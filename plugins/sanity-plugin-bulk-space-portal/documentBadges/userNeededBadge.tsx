import { checkoutActions } from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useCheckout'

export function userNeededBadge() {
  return {
    label: checkoutActions.USER_NEEDED.label,
    color: checkoutActions.USER_NEEDED.color,
    icon: checkoutActions.USER_NEEDED.icon,
  }
}
