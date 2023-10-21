import { useState } from 'react'
import { SanityDocument, groq } from 'next-sanity'
import { SanityClient } from 'sanity'
import EmojiIcon from 'components/Icon/Emoji'

export const getCheckoutStatusProps = (status, document?: any) => {
  // get the checkout date from the parent document
  const checkoutDate = document?.dates?.checkoutDate
    ? new Date(document?.dates?.checkoutDate).toLocaleDateString(`en-US`, {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })
    : document?.checkoutDate
    ? new Date(document?.checkoutDate).toLocaleDateString(`en-US`, {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const returnDate = document?.dates?.returnDate
    ? new Date(document?.dates?.returnDate).toLocaleDateString(`en-US`, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : document?.returnDate
    ? new Date(document?.returnDate).toLocaleDateString(`en-US`, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const checkoutStatus = {
    CHECKED_OUT: {
      label: `Checked Out ${checkoutDate || ''}`,
      color: 'danger',
      title: 'Items have been checked out',
      tone: 'critical',
    },
    RETURNED: {
      label: `Completed on ${returnDate || ''}`,
      color: 'success',
      title: 'Items have been returned successfully',
      tone: 'positive',
    },
    PENDING: {
      label: 'Ready for Checkout',
      color: 'default',
      title: 'This item is available to be checked out',
      tone: 'default',
    },
    USER_NEEDED: {
      label: 'User Needed',
      color: 'caution',
      title: 'Please select a user before checking this item out',
      tone: 'caution',
    },
    SPOTCHECK_NEEDED: {
      label: 'Spotcheck Needed to process return',
      color: 'caution',
      title: 'Please spotcheck this item before checking it out',
      tone: 'caution',
    },
  }

  return checkoutStatus[status]
}

export type CheckoutStatus =
  // add Pre & Post spotcheck
  | 'CHECKED_OUT' // spotcheck needed
  | 'RETURNED' // complete
  | 'SPOTCHECK_NEEDED' // spotcheck needed
  | 'PENDING' // ready

export function CheckoutBadge(props) {
  if (props.published) {
    return getCheckoutStatusProps(getCheckoutStatus, props.published)
  } else {
    return null
  }
}

// the parent document's patch function
export const checkoutActions = (status: CheckoutStatus) => {
  const checkoutActions = {
    PENDING: {
      label: 'Begin Checkout',
      color: 'primary',
      title: 'This item is available to be checked out',
      tone: 'primary',
      icon: () => <EmojiIcon>🟡</EmojiIcon>,
    },
    SPOTCHECK_NEEDED: {
      icon: () => <EmojiIcon>🟡</EmojiIcon>,
      label: 'Spotcheck Needed',
      color: 'caution',
      title: 'This item is available to be checked out',
      tone: 'caution',
    },
    CHECKED_OUT: {
      icon: () => <EmojiIcon>🔴</EmojiIcon>,
      label: 'Process Return',
      color: 'primary',
      title: 'This is checked out',
      tone: 'caution',
    },
    RETURNED: {
      icon: () => <EmojiIcon>🔵</EmojiIcon>,
      label: 'Checkout Complete',
      color: 'success',
      title: 'This has been returned',
      tone: 'positive',
    },
  }

  return checkoutActions[status]
}

export const patchStock = async (
  client,
  id: string,
  direction: 'increment' | 'decrement'
) => {
  const itemIds = await client.fetch(groq`*[_id == $id].checkoutItems[]._ref`, {
    id,
  })

  itemIds?.forEach((itemId) => {
    let patch = client.patch(itemId)

    if (direction === 'increment') {
      patch = patch.inc({ stock: 1 })
    } else if (direction === 'decrement') {
      patch = patch.dec({ stock: 1 })
    }
    const response = patch.commit().catch((e) => console.error({ e }))

    return response
  })
}

export const getCheckoutStatus = (document): CheckoutStatus => {
  if (document?.isCheckedOut && !document?.isReturned) {
    return 'CHECKED_OUT' // spotcheck needed
  } else if (document?.isCheckedOut && document?.isReturned) {
    return 'RETURNED' // complete
  } else if (!document?.isSpotChecked) {
    return 'SPOTCHECK_NEEDED' // spotcheck needed
  } else {
    return 'PENDING' // ready
  }
}

export const useInventory = (
  // the parent document
  document: SanityDocument,
  // the sanity client
  client?: SanityClient,
  // the parent document patch function
  patch?: any
) => {
  const [isPublishing, setIsPublishing] = useState(false)

  const handleProcessCheckout = async () => {
    // This will update the button text
    setIsPublishing(true)

    patchStock(
      client,
      document?._id.replace('drafts.', ''),
      !document?.isCheckedOut ? 'decrement' : 'increment'
    )
      .then(() => {
        patch.execute([
          {
            set: {
              isCheckedOut: true,
              isReturned: document?.isCheckedOut ? true : false,
            },
          },
        ])
      })
      .catch((e) => console.error({ e }))
  }

  return {
    checkoutActions: checkoutActions(getCheckoutStatus(document)),
    getCheckoutStatus: getCheckoutStatus(document),
    handleProcessCheckout,
    isPublishing,
    setIsPublishing,
  }
}
