import { _writeClient } from 'lib/sanity.client'
import { useEffect } from 'react'
import { useDataset, useDocumentOperation } from 'sanity'
import {
  checkoutActions,
  getCheckoutStatus,
} from 'schemas/documents/inventory/hooks/useCheckout'
import {
  patchStock,
  useInventory,
} from 'schemas/documents/inventory/hooks/useInventory'

export default function ProcessCheckout(props) {
  const latestDocument = props?.published
  const dataset = useDataset()

  const { patch } = useDocumentOperation(props.id, props.type)

  const { setIsPublishing } = useInventory(latestDocument, patch)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (!props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft, setIsPublishing])

  const checkoutStatus = latestDocument
    ? getCheckoutStatus(latestDocument)
    : 'PENDING'
  const action = checkoutActions[checkoutStatus]

  return {
    ...action,
    onHandle: async () => {
      if (!_writeClient || !latestDocument)
        console.error('missing client or doc')

      // This will update the button text
      setIsPublishing(true)

      //TODO: test this rigorously to make sure there are no edge cases with the UX
      patchStock(
        _writeClient.withConfig({ dataset }),
        latestDocument?._id,
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
          // publish.execute()
          props.onComplete()
        })
        .catch((e) => console.error({ e }))
    },
  }
}
