import { Card } from '@sanity/ui'

export default (props) => {
  return <Card tone="caution">{props.renderDefault(props)}</Card>
}
