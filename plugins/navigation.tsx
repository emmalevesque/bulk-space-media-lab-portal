import EmojiIcon from 'components/global/Icon/Emoji'
import { definePlugin } from 'sanity'
import { singletonDocumentTypes } from 'lib/constants'

export const icon = () => <EmojiIcon>📦</EmojiIcon>

export default definePlugin({
  name: 'navigation',
  document: {
    actions: (prev, { schemaType }) => {
      if (singletonDocumentTypes.includes(schemaType)) {
        return prev.filter(({ action }) => action !== 'delete')
      }
      return prev
    },
  },
})
