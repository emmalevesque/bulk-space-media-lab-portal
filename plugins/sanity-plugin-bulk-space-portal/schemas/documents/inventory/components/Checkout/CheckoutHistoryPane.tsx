import { Box, Flex, Grid, Heading, Text } from '@sanity/ui'

import Loading from 'components/Loading'

export default (props) => {
  if (!props?.document?.displayed?._id) return <Loading />

  return (
    <Box padding={4}>
      <Flex direction={`column`} gap={4}>
        <Heading size={2}>Checkout History</Heading>
        <Grid columns={1} gap={2}>
          <Text>This page will contain:</Text>
          <Text>Checkout User</Text>
          <Text>Checkout Items</Text>
          <Text>Checkout Date</Text>
          <Text>Return Date</Text>
          <Text>Notes</Text>
          <Text>Total Replaceable Value</Text>
        </Grid>
      </Flex>
    </Box>
  )
}
