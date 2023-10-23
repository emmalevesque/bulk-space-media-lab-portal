import { defineType } from 'sanity'
import user from './user'
import EmojiIcon from 'components/Icon/Emoji'

export default defineType({
  ...user,
  name: 'staff',
  title: 'Staff',
  icon: () => <EmojiIcon>🫂</EmojiIcon>,
  initialValue: {
    role: 'staff',
  },
  fields: [
    ...user.fields,
    {
      readOnly: true,
      name: 'role',
      type: 'string',
      options: {
        list: [
          {
            title: 'Administrator',
            value: 'administrator',
          },
          {
            title: 'Staff',
            value: 'staff',
          },
        ],
      },
    },
  ],
})
