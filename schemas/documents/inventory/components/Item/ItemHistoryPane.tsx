import { Box, Flex, Heading } from '@sanity/ui'
import Loading from 'components/Loading'

export default (props) => {
  console.log({ props })

  return document ? (
    <Box padding={4}>
      <Flex>
        <Heading size={2}>Rentals</Heading>
      </Flex>
    </Box>
  ) : (
    <Loading />
  )
}
