import { useEffect } from 'react'
import { useClient, useDocumentOperation } from 'sanity'
import {
  patchStock,
  useInventory,
} from 'schemas/documents/inventory/hooks/useInventory'

import { checkoutActions } from 'schemas/documents/inventory/hooks/useInventory'

export function ProcessCheckout(props) {
  const client = useClient({
    apiVersion: '2021-03-25',
  })
  const latestDocument = props?.draft || props?.published

  const { patch, publish } = useDocumentOperation(props.id, props.type)

  const { getCheckoutStatus, isPublishing, setIsPublishing } = useInventory(
    latestDocument,
    client,
    patch
  )

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft, isPublishing, setIsPublishing])

  console.log({
    getCheckoutStatus,
    checkoutActions: checkoutActions[getCheckoutStatus],
  })

  return {
    ...{ ...checkoutActions(getCheckoutStatus), icon: undefined },
    disabled: getCheckoutStatus === 'RETURNED' || isPublishing,
    onHandle: async () => {
      if (!client || !latestDocument) console.error('missing client or doc')

      // This will update the button text
      setIsPublishing(true)

      //TODO: test this rigorously to make sure there are no edge cases with the UX
      patchStock(
        client,
        latestDocument?._id.replace('drafts.', ''),
        !latestDocument?.isCheckedOut ? 'decrement' : 'increment'
      )
        .then(() => {
          patch.execute([
            {
              set: {
                isCheckedOut: true,
                isReturned: latestDocument?.isCheckedOut ? true : false,
                checkoutDate: !latestDocument?.isCheckedOut
                  ? new Date().toISOString()
                  : latestDocument?.checkoutDate,
                returnDate: latestDocument?.isCheckedOut
                  ? new Date().toISOString()
                  : null,
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
