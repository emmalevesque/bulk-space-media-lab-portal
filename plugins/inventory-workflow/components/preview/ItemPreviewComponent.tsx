import { Badge, Container, Flex } from '@sanity/ui'
import { useInventory } from '../../hooks/hooks/useInventory'

export default (props) => {
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
        <Badge tone={tone}>{itemStateProps?.label}</Badge>
      </Flex>
    </Container>
  )
}
