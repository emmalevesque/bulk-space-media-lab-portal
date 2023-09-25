import { Card } from '@sanity/ui'

export default (props) => {
  console.log({ props })

  return <Card tone="critical">{props.renderDefault(props)}</Card>
}
