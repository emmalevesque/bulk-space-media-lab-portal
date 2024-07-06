import { useRootTheme } from '@sanity/ui'

import BulkSpaceIconDark from './icon-dark.png'
import BulkSpaceIcon from './icon.png'

export default function Icon() {
  const isDark = useRootTheme().scheme === 'dark'

  if (isDark) {
    return (
      <img
        style={{ width: 24, height: 24 }}
        src={BulkSpaceIconDark.src}
        alt="Bulk Space"
      />
    )
  }
  return (
    <img
      style={{ width: 24, height: 24 }}
      src={BulkSpaceIcon.src}
      alt="Bulk Space"
    />
  )
}
