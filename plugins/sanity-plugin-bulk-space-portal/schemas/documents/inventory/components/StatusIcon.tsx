import EmojiIcon from '@/sanity-plugin-bulk-space-portal/components/global/Icon/Emoji'

export default ({ stock }) => <EmojiIcon>{stock === 0 ? `❌` : `🟩`}</EmojiIcon>
