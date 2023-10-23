import { Card, Flex } from '@sanity/ui'

export default (props) => {
  console.log({ props })

  const tone = !props ? 'default' : props?.stock > 0 ? 'positive' : 'critical'

  return (
    <Card tone={tone} width="stretch">
      <Flex>{props?.renderDefault(props)}</Flex>
    </Card>
  )
}
