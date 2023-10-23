import { Card, Flex } from '@sanity/ui'

export default (props) => {
  const tone = !props ? 'default' : props?.stock > 0 ? 'positive' : 'critical'

  return (
    <Card tone={tone} width="stretch" padding={2}>
      <Flex padding={3}>{props?.renderDefault(props)}</Flex>
    </Card>
  )
}
