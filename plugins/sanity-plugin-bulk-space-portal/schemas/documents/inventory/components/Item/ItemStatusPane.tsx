import { Badge, Box, Inline, Text } from '@sanity/ui'
import Loading from 'components/Loading'

export default (props) => {
  const { document } = props

  const { stock, condition } = document?.displayed

  if (condition) {
    condition.label =
      condition.rating > 6
        ? 'Excellent'
        : condition.rating > 4
        ? 'Good'
        : 'Poor'
  }

  return document?.displayed?.stock !== null ? (
    <Box padding={4}>
      <Inline space={2}>
        <Badge padding={2} tone={stock > 0 ? 'positive' : 'critical'}>
          <Text size={1} weight="semibold">
            {stock} available
          </Text>
        </Badge>
        {document?.displayed?.condition && (
          <Badge
            padding={2}
            tone={
              condition.rating > 6
                ? 'positive'
                : condition.rating > 4
                ? 'caution'
                : 'critical'
            }
          >
            <Text size={1} weight="semibold">
              {condition.label} condition
            </Text>
          </Badge>
        )}
      </Inline>
    </Box>
  ) : (
    <Loading />
  )
}
