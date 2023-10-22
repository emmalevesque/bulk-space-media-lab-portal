import { Box } from '@sanity/ui'

import { LeaveIcon } from '@sanity/icons'
import { NavigationProvider } from './hooks/useNavigation'
import PortalHomePage from './pages/Home'

export const PORTAL_BASE_PATH = '/portal-demo'

export function PortalDemoTool(props) {
  console.log({ props })

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
}
