import { Card, Flex } from '@sanity/ui'

export default (props) => {
  const tone = !props ? 'default' : props?.stock > 0 ? 'positive' : 'critical'

  return (
    <Flex style={{ width: '100%' }}>
      <Card tone={tone} className=" h-full w-full">
        {props?.renderDefault(props)}
      </Card>
    </Flex>
  )
}
