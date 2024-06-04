import { DocumentBadgeProps } from 'sanity'
import { ColorTag, ItemType } from '../types'

import { useListeningQuery } from 'sanity-plugin-utils'

export const ColorBadge = (props: DocumentBadgeProps) => {
  const { published, draft } = props ?? {}

  const latest = draft || published

  const { colorTag } = latest as ItemType

  const mapColor = (color) => {
    switch (color) {
      case 'Red':
        return 'danger'
      case 'Yellow':
        return 'warning'
      case 'Blue':
        return 'primary'
      default:
        return 'default'
    }
  }

  const {
    data: color,
    error,
    loading,
  } = useListeningQuery(
    `*[_type == 'colorTag' && $id != false && _id == $id][0]`,
    {
      params: {
        id: colorTag?._ref || false,
      },
    }
  ) as {
    data: ColorTag
    error: any
    loading: boolean
  }

  if (loading || error || !color) {
    return null
  }

  return {
    label: color?.color?.label || '',
    color: mapColor(color?.color?.label || ''),
  }
}
