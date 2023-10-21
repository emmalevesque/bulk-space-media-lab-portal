import { checkoutActions } from 'schemas/documents/inventory/hooks/useCheckout'

export function CheckedOutBadge() {
  return {
    label: checkoutActions.CHECKED_OUT.label,
    color: checkoutActions.CHECKED_OUT.color,
    icon: checkoutActions.CHECKED_OUT.icon,
  }
}
