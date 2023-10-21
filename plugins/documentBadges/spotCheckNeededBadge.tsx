import { checkoutActions } from 'schemas/documents/inventory/hooks/useCheckout'

export function SpotCheckNeededBadge() {
  return {
    label: checkoutActions.SPOTCHECK_NEEDED.label,
    color: checkoutActions.SPOTCHECK_NEEDED.color,
    icon: checkoutActions.SPOTCHECK_NEEDED.icon,
  }
}
