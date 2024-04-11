import {
  checkoutActions,
  getCheckoutStatus,
} from 'plugins/inventory-workflow/hooks/hooks/useCheckout'
import { DocumentBadgeProps } from 'sanity'

export const CheckoutBadge = (props: DocumentBadgeProps) => {
  const { published, draft } = props ?? {}
  const checkoutStatus = getCheckoutStatus(published ?? draft ?? null)

  const checkoutStatusProps = checkoutActions[checkoutStatus]

  return {
    label: checkoutStatusProps?.name,
    color: checkoutStatusProps?.color,
    title: checkoutStatusProps?.title,
  }
}
