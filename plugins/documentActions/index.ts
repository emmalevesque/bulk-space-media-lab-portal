import { processCheckout } from './processCheckout'

export default (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      processCheckout,
      ...prev.filter((a) => {
        return a.name !== 'publish'
      }),
    ]
  }
  return prev
}
