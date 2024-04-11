import CreateVariant from './variant/CreateVariant'
import ProcessCheckout from './checkout/processCheckout'
import ResetCheckout from './checkout/resetCheckout'

const documentActions = (prev, context) => {
  if (context.schemaType === 'checkout') {
    return [
      ProcessCheckout,
      ResetCheckout,
      ...prev.filter(
        (a: { action: string }) => !['publish', 'unpublish'].includes(a.action)
      ),
    ]
  } else if (context.schemaType === 'item') {
    return [
      CreateVariant,
      ...prev.filter(
        (a: { action: string }) => !['duplicate', 'publish'].includes(a.action)
      ),
    ]
  }
  return prev
}

export default documentActions
