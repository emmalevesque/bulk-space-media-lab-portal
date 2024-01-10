import { SearchIcon } from '@sanity/icons'
import { Autocomplete, Avatar, Flex, Stack, Text } from '@sanity/ui'
import { useCallback } from 'react'
import { useCurrentUser } from 'sanity'

import { set, unset } from 'sanity'

export default (props, context) => {
  const { onChange, value } = props

  const handleChange = useCallback(
    (nextValue) => {
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  const currentUser = useCurrentUser()

  if (!currentUser)
    throw new Error('There was an error trying to detect the current user.')

  const { id, name } = currentUser || {}

  return (
    <Flex direction="column" style={{ width: '100%' }}>
      <Stack space={3}>
        <Autocomplete
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
          renderValue={(value, option) => option?.payload?.name || value}
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
        />
      </Stack>
    </Flex>
  )
}
