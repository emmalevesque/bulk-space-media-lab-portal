import { client } from 'lib/sanity.client'
import { useState, useEffect } from 'react'
import { useDocumentOperation } from 'sanity'
import { patchStock } from 'schemas/documents/inventory/hooks/useInventory'

export function checkoutActions(props) {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  if (props.type == 'checkout') {
    useEffect(() => {
      // if the isPublishing state was set to true and the draft has changed
      // to become `null` the document has been published
      if (isPublishing && !props.draft) {
        setIsPublishing(false)
      }
    }, [props.draft])

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
}
