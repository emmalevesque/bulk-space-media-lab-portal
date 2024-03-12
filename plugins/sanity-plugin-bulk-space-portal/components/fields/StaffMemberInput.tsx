import { Flex, Stack } from '@sanity/ui'
import { useCurrentUser } from 'sanity'

export default (props) => {
  const currentUser = useCurrentUser()

  if (!currentUser)
    throw new Error('There was an error trying to detect the current user.')

  return (
    <Flex direction="column" style={{ width: '100%' }}>
      <Stack space={3}>
        {props?.renderDefault(props)}
        {/* <Autocomplete
          filterOption={(query, option) =>
            option.payload.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          }
          value={value}
          onChange={handleChange}
          icon={SearchIcon}
          openButton
          options={[
            {
              value: `staff.${currentUser?.id}`,
              payload: {
                userId: currentUser?.id,
                name: currentUser?.name,
                imageUrl: currentUser?.profileImage,
              },
            },
          ]}
          id={`staffMember`}
          renderOption={(option) => {
            const { name, imageUrl } = option.payload
            return (
              <Flex
                padding={1}
                align="center"
                gap={3}
                className="hover:opacity-75"
              >
                <Avatar size={2} src={imageUrl} />
                <Text size={2}>{name}</Text>
              </Flex>
            )
          }}
        /> */}
      </Stack>
    </Flex>
  )
}
