import { Box, Text } from '@sanity/ui'
import Header from 'tools/PortalDemo/Header'
import { NavigationProvider } from 'tools/PortalDemo/hooks/useNavigation'

export default function HomepageRoute() {
  return (
    <NavigationProvider>
      <Box padding={4}>
        <Header />
        <Text size={2}>Welcome to the Portal Demo!</Text>
      </Box>
    </NavigationProvider>
  )
}
