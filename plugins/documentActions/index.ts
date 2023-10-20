import { ProcessCheckout } from './processCheckout'
import resetCheckout from './resetCheckout'

const documentActions = (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      ProcessCheckout,
      resetCheckout,
      ...prev.filter((a) => {
        return a.name !== 'publish'
      }),
    ]
  }
  return prev
}

export default documentActions
