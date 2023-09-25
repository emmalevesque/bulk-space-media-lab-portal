import { BadgeProps } from '@sanity/ui'
import { useMemo } from 'react'
import { DocumentBadgeDescription } from 'sanity'

const badge = (document): DocumentBadgeDescription => ({
  label: !document?.isCheckedOut ? 'Not yet checked out' : 'Checked Out',
  color: !document?.isCheckedOut ? 'success' : 'danger',
  title: !document?.isCheckedOut
    ? 'This item is checked in'
    : 'This item is checked out',
})

export function CheckoutBadge(props) {
  if (props.published) {
    return badge(props?.published)
  } else {
    return null
  }
}
