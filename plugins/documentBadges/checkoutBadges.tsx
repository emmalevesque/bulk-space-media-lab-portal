import { useInventory } from 'schemas/documents/inventory/hooks/useInventory'

const checkoutBadges = {
  CHECKED_OUT: {
    label: 'Checked out',
    color: 'danger',
    title: 'This is checked out',
    tone: 'critical',
  },
  RETURNED: {
    label: 'Returned',
    color: 'success',
    title: 'This has been returned',
    tone: 'positive',
  },
  READY: {
    label: 'Available to checkout',
    color: 'default',
    title: 'This item is available to be checked out',
    tone: 'default',
  },
}

export type CheckoutStatus = 'CHECKED_OUT' | 'RETURNED' | 'READY'

export function CheckoutBadge(props) {
  const { checkoutStatus } = useInventory(props?.published)
  if (props.published) {
    return checkoutBadges[checkoutStatus]
  } else {
    return null
  }
}
