import {
  checkoutActions,
  getCheckoutStatus,
} from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useCheckout'

export const CheckoutBadge = (props) => {
  const checkoutStatus = getCheckoutStatus(props?.published)

  const checkoutStatusProps = checkoutActions[checkoutStatus]

  return {
    label: checkoutStatusProps?.name,
    color: checkoutStatusProps?.color,
    title: checkoutStatusProps?.title,
  }
}
