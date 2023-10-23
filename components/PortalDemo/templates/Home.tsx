import { Box, Flex, Text } from '@sanity/ui'
import Header from '../Header'

export default function PortalHomePage(props) {
  return (
    <Flex direction={`column`} gap={4}>
      <Header {...props} />
      <Box padding={2}>
        <Text>Welcome to the Portal Demo!</Text>
      </Box>
    </Flex>
  )
}
