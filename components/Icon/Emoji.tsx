import { Text } from '@sanity/ui'

export default function EmojiIcon({ children }: { children: string }) {
  return (
    <Text
      size={4}
      weight="bold"
      style={{ display: 'inline-block', width: '1.5em', textAlign: 'center' }}
    >
      {children}
    </Text>
  )
}
