import EmojiIcon from 'components/global/Icon/Emoji'

export default ({ stock }) => <EmojiIcon>{stock === 0 ? `❌` : `🟩`}</EmojiIcon>
