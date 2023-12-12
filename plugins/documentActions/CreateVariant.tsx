import { _writeClient } from 'lib/sanity.client'
import { useEffect } from 'react'
import { useDataset, useDocumentOperation } from 'sanity'
import {
  checkoutActions,
  getCheckoutStatus,
} from 'schemas/documents/inventory/hooks/useCheckout'
import { useInventory } from 'schemas/documents/inventory/hooks/useInventory'

export default function CreateVariant(props) {
  const latestDocument = props?.draft || props?.published
  const dataset = useDataset()

  const { patch, publish } = useDocumentOperation(props.id, props.type)

  const { setIsPublishing } = useInventory(latestDocument, patch)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (!props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft, setIsPublishing])

  const checkoutStatus = getCheckoutStatus(latestDocument)
  const action = checkoutActions[checkoutStatus]

  return {
    ...action,
    onHandle: async () => {
      if (!_writeClient || !latestDocument)
        console.error('missing client or doc')

      // This will update the button text
      setIsPublishing(true)

      // TODO: duplicate and update the resulting document
    },
  }
}
