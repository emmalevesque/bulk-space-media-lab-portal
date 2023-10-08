import { processCheckout } from './processCheckout'
import resetCheckout from './resetCheckout'

export default (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      processCheckout,
      resetCheckout,
      ...prev.filter((a) => {
        return a.name !== 'publish'
      }),
    ]
  }
  return prev
}
