import { checkoutActions } from 'plugins/inventory-workflow/hooks/hooks/useCheckout'

export function ReturnedBadge() {
  return {
    label: checkoutActions.RETURNED.label,
    color: checkoutActions.RETURNED.color,
    icon: checkoutActions.RETURNED.icon,
  }
}
