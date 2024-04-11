import { checkoutActions } from 'plugins/inventory-workflow/hooks/hooks/useCheckout'

export function PendingBadge() {
  return {
    label: checkoutActions.PENDING.label,
    color: checkoutActions.PENDING.color,
    icon: checkoutActions.PENDING.icon,
  }
}
