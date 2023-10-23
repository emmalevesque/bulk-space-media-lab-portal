import { Flex, Heading } from '@sanity/ui'
import NavigationComponent from './Navigation'

export default function Header() {
  return (
    <Flex align={`center`} justify={'space-between'} padding={2}>
      <Heading size={2} as="h2">
        Portal Demo
      </Heading>
      <NavigationComponent />
    </Flex>
  )
}
