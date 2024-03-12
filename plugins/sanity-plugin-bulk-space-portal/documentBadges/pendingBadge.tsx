import { checkoutActions } from 'schemas/documents/inventory/hooks/useCheckout'

export function PendingBadge() {
  return {
    label: checkoutActions.PENDING.label,
    color: checkoutActions.PENDING.color,
    icon: checkoutActions.PENDING.icon,
  }
}
