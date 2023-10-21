import { defineType } from 'sanity'
import user from './user'
import EmojiIcon from 'components/Icon/Emoji'

export default defineType({
  ...user,
  name: 'staff',
  title: 'Staff',
  icon: () => <EmojiIcon>🫂</EmojiIcon>,
})
