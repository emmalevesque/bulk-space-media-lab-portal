import ProcessCheckout from './processCheckout'
import ResetCheckout from './resetCheckout'

const documentActions = (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      ProcessCheckout,
      ResetCheckout,
      ...prev.filter(
        (a: { action: string }) => !['publish', 'unpublish'].includes(a.action)
      ),
    ]
  }
  return prev
}

export default documentActions
