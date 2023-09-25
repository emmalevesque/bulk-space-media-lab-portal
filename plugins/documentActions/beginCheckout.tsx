import { CheckmarkCircleIcon } from '@sanity/icons'
import { useState, useEffect, useCallback } from 'react'
import { useClient, useDocumentOperation } from 'sanity'
import { patchStock } from 'schemas/documents/inventory/item'

export function beginCheckout(props) {
  const client = useClient({
    apiVersion: '2021-03-25',
  })
  const latestDocument = props?.published || props?.draft

  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [props.draft])

  return {
    disabled: publish.disabled,
    icon: CheckmarkCircleIcon,
    label: isPublishing ? 'Completing checkout...' : 'Complete Checkout',
    onHandle: useCallback(async () => {
      // This will update the button text
      setIsPublishing(true)

      patchStock(
        client,
        latestDocument?._id.replace('drafts.', ''),
        'decrement'
      )
        .then((r) => {
          publish.execute()
          props.onComplete()
          patch.execute([
            {
              set: {
                isCheckedOut: true,
                spotChecked: false,
              },
            },
          ])
        })
        .catch((e) => console.error({ e }))
    }, [isPublishing, setIsPublishing, publish]),
  }
}
