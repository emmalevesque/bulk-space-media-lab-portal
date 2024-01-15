import { GenerateIcon } from '@sanity/icons'
import { useDocumentOperation } from 'sanity'

export default (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  return {
    icon: GenerateIcon,
    label: 'Reset Checkout',
    onHandle: async () => {
      patch.execute([
        {
          set: {
            isCheckedOut: false,
            isReturned: false,
          },
        },
      ])
      publish.execute()
      props.onComplete()
    },
  }
}
