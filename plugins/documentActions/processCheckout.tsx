import { CheckmarkCircleIcon, UserIcon, ClockIcon } from '@sanity/icons'
import { groq } from 'next-sanity'
import { useState, useEffect } from 'react'
import { useClient, useDocumentOperation } from 'sanity'
import {
  checkoutActions,
  patchStock,
  useInventory,
} from 'schemas/documents/inventory/hooks/useInventory'

export function processCheckout(props) {
  const client = useClient({
    apiVersion: '2021-03-25',
  })
  const latestDocument = props?.draft || props?.published

  const { patch, publish } = useDocumentOperation(props.id, props.type)

  const { checkoutStatus, checkoutActions, isPublishing, setIsPublishing } =
    useInventory(latestDocument, client, patch)

  console.log({
    checkoutStatus,
    checkoutActions,
    isPublishing,
    setIsPublishing,
  })

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft])

  return {
    ...checkoutActions[checkoutStatus],
    disabled: checkoutStatus === 'RETURNED' || isPublishing,
    onHandle: async () => {
      // This will update the button text
      setIsPublishing(true)

      patchStock(
        client,
        latestDocument?._id.replace('drafts.', ''),
        !latestDocument?.isCheckedOut ? 'decrement' : 'increment'
      )
        .then((r) => {
          patch.execute([
            {
              set: {
                isCheckedOut: true,
                isReturned: latestDocument?.isCheckedOut ? true : false,
              },
            },
          ])
          publish.execute()
          props.onComplete()
        })
        .catch((e) => console.error({ e }))
    },
  }
}
