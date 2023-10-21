// import { PendingBadge } from './pendingBadge'
// import { itemsNeededBadge } from './itemsNeededBadge'
// import { userNeededBadge } from './userNeededBadge'
// import { ReturnedBadge } from './returnedBadge'
// import { CheckedOutBadge } from './checkedOutBadge copy'
// import { SpotCheckNeededBadge } from './spotCheckNeededBadge'

// const checkoutBadgeComponents = {
//   PENDING: PendingBadge,
//   SPOTCHECK_NEEDED: SpotCheckNeededBadge,
//   CHECKED_OUT: CheckedOutBadge,
//   RETURNED: ReturnedBadge,
//   USER_NEEDED: userNeededBadge,
//   ITEMS_NEEDED: itemsNeededBadge,
//   DEFAULT: PendingBadge,
// }

export default (prev) => {
  // const { documentId, schemaType } = context

  // if (schemaType.name === 'checkout') {
  //   const checkoutStatus = document ? getCheckoutStatus(document) : 'PENDING'

  //   return [checkoutBadgeComponents[checkoutStatus], ...prev]
  // }

  return prev
}
