'use client'
import { Box, Flex, studioTheme, ThemeProvider } from '@sanity/ui'
import Header from 'components/PortalDemo/Header'
import { NavigationProvider } from 'components/PortalDemo/hooks/useNavigation'

export default function PortalLayout({ children }) {
  return (
    <ThemeProvider theme={studioTheme}>
      <NavigationProvider>
        <Flex padding={5} direction={`column`} gap={4}>
          <Header />
          <Box padding={2}>{children}</Box>
        </Flex>
      </NavigationProvider>
    </ThemeProvider>
  )
}
