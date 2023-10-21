import EmojiIcon from 'components/Icon/Emoji'

export default ({ stock }) => <EmojiIcon>{stock === 0 ? `🟥` : `🟩`}</EmojiIcon>
