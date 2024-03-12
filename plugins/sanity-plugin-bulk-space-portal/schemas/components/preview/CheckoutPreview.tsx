import { Card } from '@sanity/ui'

const CheckoutPreview = (props) => {
  return <Card tone="caution">{props.renderDefault(props)}</Card>
}

export default CheckoutPreview
