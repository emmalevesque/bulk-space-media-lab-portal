import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/Icon/Emoji'

export default ({ stock }) => <EmojiIcon>{stock === 0 ? `❌` : `🟩`}</EmojiIcon>
