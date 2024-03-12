import { client } from 'lib/sanity.client'
import { useEffect, useState } from 'react'
import { useDocumentOperation } from 'sanity'
import { patchStock } from 'schemas/documents/inventory/hooks/useInventory'

export function CheckoutActions(props) {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (props.type == 'checkout') {
      // if the isPublishing state was set to true and the draft has changed
      // to become `null` the document has been published
      if (!props.draft) {
        setIsPublishing(false)
      }
    }
  }, [props.draft, props.type])

  return {
    disabled: publish.disabled,
    label: isPublishing ? 'Completing Checkout…' : 'Complete Checkout',
    onHandle: () => {
      // This will update the button text
      setIsPublishing(true)

      // Set publishedAt to current date and time
      patch.execute([{ set: { publishedAt: new Date().toISOString() } }])

      // TODO: debug
      // Patch the inventory
      patchStock(client, props.id.replace('drafts.', ''), 'decrement')

      // Perform the publish
      publish.execute()

      // Signal that the action is completed
      props.onComplete()
    },
  }
}
