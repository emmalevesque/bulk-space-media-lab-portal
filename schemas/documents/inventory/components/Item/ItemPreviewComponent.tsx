import { Badge, Container, Flex } from '@sanity/ui'

export default (props) => {
  if (props?.stock === undefined) return null
  const badge = props?.stock > 0 ? 'In Stock' : 'Out of Stock'

  if (!props?.stock === undefined) return null

  return (
    <Container padding={2} width="auto">
      <Flex justify="space-between" align="center">
        <div style={{ maxWidth: '80%' }}>{props?.renderDefault(props)}</div>
        <Badge mode="outline" tone={props?.stock > 0 ? 'positive' : 'critical'}>
          {badge}
        </Badge>
      </Flex>
    </Container>
  )
}
