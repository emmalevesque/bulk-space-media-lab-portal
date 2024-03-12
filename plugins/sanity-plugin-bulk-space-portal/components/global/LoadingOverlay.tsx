import { Flex, Spinner } from '@sanity/ui'

export default function LoadingOverlay() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Flex direction={'column'} align={'center'} gap={3}>
        <Spinner muted />
      </Flex>
    </div>
  )
}
