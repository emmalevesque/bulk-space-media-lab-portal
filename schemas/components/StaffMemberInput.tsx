import { Avatar, Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui'
import { useCurrentUser } from 'sanity'

export default (props, context) => {
  console.log({ props, context })

  const currentUser = useCurrentUser()

  console.log({ currentUser })

  if (!currentUser)
    throw new Error('There was an error trying to detect the current user.')

  const { id, name } = currentUser || {}

  return (
    <Flex direction="column" style={{ width: '100%' }}>
      <Card>
        <Stack space={3}>
          <Card padding={3} shadow={1} radius={2}>
            <Button style={{ width: '100%' }}>
              <Flex gap={3} justify="flex-start" align="center" padding={3}>
                <Avatar size={2} src={currentUser?.profileImage} />
                <Text size={2} weight="semibold">
                  {name}
                </Text>
              </Flex>
            </Button>
          </Card>
          <TextInput
            hidden
            readOnly
            value={`staff.${currentUser?.id}` || 'Detecting User...'}
          />
        </Stack>
      </Card>
    </Flex>
  )
}
