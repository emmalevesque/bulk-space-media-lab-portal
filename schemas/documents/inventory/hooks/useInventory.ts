import { CheckmarkCircleIcon, ClockIcon, UserIcon } from '@sanity/icons'
import { useState } from 'react'
import { SanityDocument, groq } from 'next-sanity'
import { SanityClient } from 'sanity'
import { CheckoutStatus } from '../checkout'

// the parent document's patch function
export const checkoutActions = {
  READY: {
    icon: ClockIcon,
    label: 'Begin Checkout',
    color: 'primary',
    title: 'This item is available to be checked out',
    tone: 'critical',
  },
  CHECKED_OUT: {
    icon: UserIcon,
    label: 'Process Return',
    color: 'primary',
    title: 'This is checked out',
    tone: 'caution',
  },
  RETURNED: {
    icon: CheckmarkCircleIcon,
    label: 'Checkout Completed',
    color: 'success',
    title: 'This has been returned',
    tone: 'positive',
  },
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
    const response = patch

      .commit()
      .then((r) => {})
      .catch((e) => console.error({ e }))

    return response
  })
}

export const checkoutStatus = (document): CheckoutStatus => {
  if (!document?.isCheckedOut && !document?.isReturned) {
    return 'READY'
  } else if (document?.isCheckedOut && !document?.isReturned) {
    return 'CHECKED_OUT'
  } else {
    return 'RETURNED'
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
      .then((r) => {
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
    checkoutActions,
    checkoutStatus: checkoutStatus(document),
    handleProcessCheckout,
    isPublishing,
    setIsPublishing,
  }
}
