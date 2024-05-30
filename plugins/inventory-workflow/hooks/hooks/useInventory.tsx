/* eslint-disable react-hooks/exhaustive-deps */
import { _writeClient } from 'lib/sanity.client'
import { SanityDocument, groq } from 'next-sanity'
import { useCallback, useEffect, useState } from 'react'
import { useDataset } from 'sanity'
import { InventoryHook, ItemState } from 'plugins/inventory-workflow/types'

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

export const ItemStates = {
  AVAILABLE: {
    label: 'Available',
    title: 'This Item is Available',
    color: 'success',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    title: 'This Item is Checked Out',
    color: 'warning',
  },
  RETURNED: {
    label: 'Returned',
    title: 'This Item is Returned',
    color: 'success',
  },
  NO_STOCK: {
    label: 'No Stock',
    title: 'This Item is Out of Stock',
    color: 'danger',
  },
  PENDING: {
    label: 'Pending',
    title: 'This Item is Pending',
    color: 'warning',
  },
}

// create a type for all the keys of ItemStates

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

  const getRelatedCheckouts = async () => {
    const relatedCheckouts = await client.fetch(
      groq`
        *[
          references("$id")
        ][]
        | order(checkoutDate desc)
        {
          ...,
          "user": user->name,
          "checkoutItems": checkoutItems[]->
        }
    `,
      {
        id: document?._id,
      }
    )

    return relatedCheckouts
  }

  const [itemAvailability, setItemAvailability] = useState<boolean>(true)

  const getItemAvailability = async () => {
    return await client.fetch(
      groq`
        *[
          $id &&
          _id == $id
        ][0].stock
    `,
      {
        id: document?._id || false,
      }
    )
  }

  useEffect(() => {
    if (document)
      getItemAvailability().then((stock) =>
        setItemAvailability(stock > 0 ? true : false)
      )
  }, [document])

  const [relatedCheckouts, setRelatedCheckouts] =
    useState<Pick<InventoryHook, 'relatedCheckouts'>>()
  useEffect(() => {
    if (document?._id) getRelatedCheckouts().then(setRelatedCheckouts)
  }, [document?._id])

  const getItemState = (): ItemState => {
    if (itemAvailability) return 'AVAILABLE'
    if (!itemAvailability) return 'CHECKED_OUT'

    return 'PENDING'
  }

  const [itemState, setItemState] = useState<ItemState>('PENDING')

  useEffect(() => {
    if (document) setItemState(getItemState())
  }, [document])

  useEffect(() => {
    console.log({ itemState })
  }, [itemState])

  const [itemStateProps, setItemStateProps] = useState(ItemStates.PENDING)

  useEffect(() => {
    if (document) setItemStateProps(ItemStates[itemState])
  }, [document, itemState])

  return {
    handleProcessCheckout,
    itemAvailability,
    relatedCheckouts,
    // checkoutHistory,
    isPublishing,
    setIsPublishing,
    itemState,
    itemStateProps,
  }
}
