import { checkoutActions } from 'plugins/inventory-workflow/hooks/hooks/useCheckout'

export function userNeededBadge() {
  return {
    label: checkoutActions.USER_NEEDED.label,
    color: checkoutActions.USER_NEEDED.color,
    icon: checkoutActions.USER_NEEDED.icon,
  }
}
