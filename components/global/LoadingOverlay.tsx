import { Flex, Spinner } from '@sanity/ui'

export default function LoadingOverlay() {
  return (
    <Flex direction={'column'} align={'center'} gap={3}>
      Loading
      <Spinner muted />
    </Flex>
  )
}
