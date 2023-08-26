import EmojiIcon from 'components/Icon/Emoji'
import { definePlugin } from 'sanity'
import { singletonDocumentTypes } from 'sanity.config'

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
