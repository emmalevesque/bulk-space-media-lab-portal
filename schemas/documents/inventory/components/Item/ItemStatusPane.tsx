import { Box, Inline, Text } from '@sanity/ui'
import Loading from 'components/Loading'

export default (props) => {
  const { document } = props

  const { stock } = document?.displayed

  return document?.displayed?.stock ? (
    <Box padding={4}>
      <Inline space={2}>
        <Box
          padding={2}
          style={{ backgroundColor: '#f5f5f5' }}
          color={stock < 1 ? 'critical' : 'positive'}
        >
          <Text size={1} weight="semibold">
            {stock === 0 ? 'Checked out' : 'Available'}
          </Text>
        </Box>
        <Box
          padding={2}
          style={{ backgroundColor: '#f5f5f5' }}
          color="positive"
        >
          <Inline>
            <Text size={1} weight="semibold">
              {stock} available
            </Text>
          </Inline>
        </Box>
      </Inline>
    </Box>
  ) : (
    <Loading />
  )
}
