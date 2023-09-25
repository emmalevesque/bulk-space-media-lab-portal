import { CheckmarkCircleIcon, UserIcon } from '@sanity/icons'
import { useState, useEffect, useCallback } from 'react'
import { useClient, useDocumentOperation } from 'sanity'
import { patchStock } from 'schemas/documents/inventory/item'

export function processCheckout(props) {
  const client = useClient({
    apiVersion: '2021-03-25',
  })
  const latestDocument = props?.draft || props?.published

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
    icon: UserIcon,
    CheckmarkCircleIcon,
    label: isPublishing
      ? 'Processing...'
      : `Process ${latestDocument?.isCheckedOut ? 'Return' : 'Checkout'}`,
    tone: latestDocument?.isCheckedOut ? 'positive' : 'caution',
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
                isCheckedOut: latestDocument?.isCheckedOut ? false : true,
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
