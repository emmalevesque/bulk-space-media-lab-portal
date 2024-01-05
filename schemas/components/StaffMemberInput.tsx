import { Card, Flex, Stack, TextInput } from '@sanity/ui'
import { useCurrentUser } from 'sanity'

export default (props, context) => {
  console.log({ props, context })

  const currentUser = useCurrentUser()

  return (
    <Flex direction="column" style={{ width: '100%' }}>
      <Card>
        <Stack space={3}>
          <TextInput
            readOnly
            value={currentUser?.name || 'Detecting User...'}
          />
        </Stack>
      </Card>
    </Flex>
  )
}
