import CreateVariant from './variant/CreateVariant'
import ProcessCheckout from './checkout/processCheckout'
import ResetCheckout from './checkout/resetCheckout'

const actions = (prev, context) => {
  console.log({ actionsContext: context })
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
      ...prev.filter(({ action }) => ['delete'].includes(action)),
    ]
  } else {
    return prev
  }
}

export default actions
