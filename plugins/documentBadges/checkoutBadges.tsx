import { BadgeProps } from '@sanity/ui'
import { useMemo } from 'react'
import { DocumentBadgeDescription } from 'sanity'

const badge = (isCheckedOut: boolean): DocumentBadgeDescription => ({
  label: !isCheckedOut ? 'Checked In' : 'Checked Out',
  color: !isCheckedOut ? 'success' : 'danger',
  title: !isCheckedOut ? 'This item is checked in' : 'This item is checked out',
})

export function CheckoutBadge(props) {
  if (props.published) {
    return badge(props?.published?.isCheckedOut)
  } else {
    return null
  }
}
