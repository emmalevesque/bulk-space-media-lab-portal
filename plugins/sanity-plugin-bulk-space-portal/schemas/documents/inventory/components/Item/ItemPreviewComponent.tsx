import { Badge, Container, Flex } from '@sanity/ui'
import { useInventory } from '../../hooks/useInventory'

export default (props) => {
  if (props?.stock === undefined) return null
  const badge = props?.stock > 0 ? 'In Stock' : 'Out of Stock'

  if (!props?.stock === undefined) return null

  const { itemStateProps } = useInventory(props)

  const tone =
    itemStateProps?.color === 'success'
      ? 'positive'
      : itemStateProps?.color === 'danger'
      ? 'critical'
      : 'default'

  return (
    <Container padding={2} width="auto">
      <Flex justify="space-between" align="center">
        <div style={{ maxWidth: '80%' }}>{props?.renderDefault(props)}</div>
        <Badge mode="outline" tone={tone}>
          {itemStateProps?.label}
        </Badge>
      </Flex>
    </Container>
  )
}
