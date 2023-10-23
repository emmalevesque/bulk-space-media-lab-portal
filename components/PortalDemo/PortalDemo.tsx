import { Box } from '@sanity/ui'

import { LeaveIcon } from '@sanity/icons'
import { NavigationProvider } from './hooks/useNavigation'
import PortalHomePage from './templates/Home'
import { Tool } from 'sanity'

export const PORTAL_BASE_PATH = '/portal-demo'

export function PortalDemoTool(props) {
  return (
    <NavigationProvider>
      <Box padding={4}>
        <PortalHomePage {...props} />
      </Box>
    </NavigationProvider>
  )
}

export default {
  name: 'portal-demo',
  title: 'Portal Demo',
  icon: LeaveIcon,
  component: PortalDemoTool,
} as Tool
