import ProcessCheckout from './processCheckout'
import ResetCheckout from './resetCheckout'

const documentActions = (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      ProcessCheckout,
      ResetCheckout,
      ...prev.filter((a) => {
        return a.name !== 'publish'
      }),
    ]
  }
  return prev
}

export default documentActions
