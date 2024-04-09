import { Flex, Spinner } from '@sanity/ui'

export default function Loading() {
  return (
    <Flex align="flex-start" height="stretch" justify="flex-start" padding={4}>
      <Spinner />
    </Flex>
  )
}
