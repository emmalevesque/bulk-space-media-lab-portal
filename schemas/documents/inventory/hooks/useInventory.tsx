import { useState } from 'react'
import { SanityDocument, groq } from 'next-sanity'
import { SanityClient } from 'sanity'

export const patchStock = async (
  client,
  id: string,
  direction: 'increment' | 'decrement'
) => {
  const itemIds = await client.fetch(
    groq`
      *[
        _id == $id
      ].checkoutItems[]._ref
  `,
    {
      id,
    }
  )

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
    handleProcessCheckout,
    isPublishing,
    setIsPublishing,
  }
}
