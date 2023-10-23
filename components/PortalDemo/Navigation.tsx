import { Box, Flex } from '@sanity/ui'
import Link from 'next/link'

import { useNavigation } from './hooks/useNavigation'

export default function NavigationComponent() {
  const { urlPrefix } = useNavigation()

  return (
    <Box padding={4}>
      <Flex justify={`space-between`} align={`center`} gap={4}>
        <Link href={`${urlPrefix}/rent`}>Rent Equipment</Link>
        <Link href={`${urlPrefix}/about`}>About</Link>
      </Flex>
    </Box>
  )
}