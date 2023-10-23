/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import { SanityDocument, groq } from 'next-sanity'
import { useDataset } from 'sanity'
import { _writeClient } from 'lib/sanity.client'
import { CheckoutType } from './useCheckout'

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

export type InventoryHook = {
  handleProcessCheckout: () => void
  itemAvailability: number
  relatedCheckouts: CheckoutType[] | null
  checkoutHistory: CheckoutType | null
  isPublishing: boolean
  // eslint-disable-next-line no-unused-vars
  setIsPublishing: (value: boolean) => void
}

export const useInventory = (
  // the parent document
  document: SanityDocument,
  // the parent document patch function
  patch?: any
) => {
  const dataset = useDataset()
  const client = _writeClient.withConfig({ dataset })

  if (!client) throw new Error('Missing client')

  const [isPublishing, setIsPublishing] = useState(false)

  const handleProcessCheckout = useCallback(async () => {
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
  }, [document?._id])

  const getItemAvailability = async () => {
    const item = await client.fetch(
      groq`
        *[
          _id == "$id"
        ][0]
    `,
      {
        id: document?._id,
      }
    )

    return item?.stock
  }

  const getRelatedCheckouts = async () => {
    const relatedCheckouts = await client.fetch(
      groq`
        *[
          references("$id")
        ][]
        | order(checkoutDate desc)
        {
          ...,
          "user": user->name
        }
    `,
      {
        id: document?._id,
      }
    )

    return relatedCheckouts
  }

  // const getCheckoutHistory = async (): Promise<CheckoutType> => {
  //   const checkoutHistory = await client.fetch(
  //     groq`
  //       *[
  //         $id == _id
  //       ][0]
  //       {
  //         ...,
  //         "user": user->name,
  //         "checkoutItems": checkoutItems[]->,
  //         "totalReplacementValue": math::sum(checkoutItems[]->.replacementValue),
  //       }
  //   `,
  //     {
  //       id: document?._id,
  //     }
  //   )

  //   return checkoutHistory
  // }

  const [itemAvailability, setItemAvailability] = useState<number>(0)
  const [relatedCheckouts, setRelatedCheckouts] =
    useState<Pick<InventoryHook, 'relatedCheckouts'>>()
  // const [checkoutHistory, setCheckoutHistory] = useState<CheckoutType>()

  useEffect(() => {
    if (document?._id) getItemAvailability().then(setItemAvailability)
  }, [document?._id])

  useEffect(() => {
    if (document?._id) getRelatedCheckouts().then(setRelatedCheckouts)
  }, [document?._id])

  // useEffect(() => {
  //   getCheckoutHistory().then(setCheckoutHistory)
  // }, [document?._id])

  return {
    handleProcessCheckout,
    itemAvailability,
    relatedCheckouts,
    // checkoutHistory,
    isPublishing,
    setIsPublishing,
  }
}
