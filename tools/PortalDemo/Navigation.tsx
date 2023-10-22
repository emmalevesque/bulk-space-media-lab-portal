import { Box, Flex } from '@sanity/ui'
import Link from 'next/link'

import { useNavigation } from './hooks/useNavigation'

export default function NavigationComponent(props) {
  console.log({ props })

  const { urlPrefix } = useNavigation()

  return (
    <Box padding={4}>
      <Flex justify={`space-between`} align={`center`} gap={4}>
        <Link href={`${urlPrefix}/inventory`}>Inventory</Link>
        <Link href={`${urlPrefix}/calendar`}>Calendar</Link>
      </Flex>
    </Box>
  )
}
