import {
  AddIcon,
  CheckmarkCircleIcon,
  EllipsisHorizontalIcon,
  UserIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import EmojiIcon from 'components/Icon/Emoji'
import moment from 'moment'
import { SanityDocument } from 'next-sanity'
import type { ItemType } from '../item'

export type CheckoutStatus =
  // add Pre & Post spotcheck
  | 'CHECKED_OUT' // spotcheck needed
  | 'RETURNED' // complete
  | 'SPOTCHECK_NEEDED' // spotcheck needed
  | 'USER_NEEDED'
  | 'ITEMS_NEEDED'
  | 'NO_STOCK' // ready
  | 'PENDING' // ready

export type CheckoutType = SanityDocument & {
  _type: 'checkout'
  isCheckedOut: boolean
  isReturned: boolean
  isSpotChecked: boolean
  user: {
    _type: 'reference'
    _ref: string
  }
  checkoutItems: {
    _type: 'reference'
    _ref: string
    _weak?: boolean
    stock?: number
    item?: ItemType
  }[]
  checkoutDate: string
  returnDate?: string
  notes?: {
    _type: 'block'
    children: {
      _type: 'span'
      text: string
    }[]
  }[]
}
export const getCheckoutStatus = (document): CheckoutStatus => {
  if (!document?.isCheckedOut) {
    if (!document?.user) {
      return 'USER_NEEDED'
    } else if (
      !Array.isArray(document?.checkoutItems) ||
      !document?.checkoutItems[0]._ref
    ) {
      return 'ITEMS_NEEDED'
    }
  }

  if (document?.isCheckedOut && document?.isReturned) {
    return 'RETURNED'
  } else if (document?.isCheckedOut && !document?.isReturned) {
    return 'CHECKED_OUT'
  } else if (!document?.isCheckedOut && document?.isReturned) {
    return 'RETURNED'
  } else if (
    document?.isCheckedOut &&
    !document?.isReturned &&
    !document?.isSpotChecked &&
    !document?.user
  ) {
    return 'SPOTCHECK_NEEDED'
  } else if (!document?.isCheckedOut && !document?.isReturned) {
    return 'PENDING'
  }
  return 'PENDING'
}

export const checkoutActions = {
  NEW: {
    label: 'Begin Checkout',
    color: 'primary',
    title: 'This item is available to be checked out',
    tone: 'primary',
    icon: EllipsisHorizontalIcon,
    emoji: AddIcon,
  },
  PENDING: {
    label: 'Begin Checkout',
    color: 'primary',
    title: 'This item is available to be checked out',
    tone: 'primary',
    icon: EllipsisHorizontalIcon,
    emoji: () => <EmojiIcon>⋯</EmojiIcon>,
  },
  NO_STOCK: {
    label: 'No Stock',
    color: 'caution',
    title: 'This item is out of stock',
    tone: 'caution',
    icon: WarningOutlineIcon,
    disabled: true,
    emoji: () => <EmojiIcon>🟥</EmojiIcon>,
  },
  SPOTCHECK_NEEDED: {
    label: 'Spotcheck Needed',
    color: 'caution',
    title: 'Please spotcheck this item before processing the return',
    tone: 'caution',
    icon: WarningOutlineIcon,
    disabled: true,
    emoji: () => <EmojiIcon>🔎</EmojiIcon>,
  },
  CHECKED_OUT: {
    label: 'Process Return',
    color: 'primary',
    title: 'This is checked out',
    tone: 'caution',
    icon: EllipsisHorizontalIcon,
    emoji: () => <EmojiIcon>❌</EmojiIcon>,
  },
  RETURNED: {
    label: 'Checkout Complete',
    color: 'success',
    title: 'This has been returned',
    tone: 'positive',
    icon: CheckmarkCircleIcon,
    disabled: true,
    emoji: () => <EmojiIcon>🟩</EmojiIcon>,
  },
  USER_NEEDED: {
    label: 'Select User',
    color: 'caution',
    title: 'Please select a user before checking this item out',
    tone: 'caution',
    icon: UserIcon,
    disabled: true,
    emoji: () => <EmojiIcon>👤</EmojiIcon>,
  },
  ITEMS_NEEDED: {
    label: 'Select Items',
    color: 'caution',
    title: 'Please select inventory items before checking this item out',
    tone: 'caution',
    disabled: true,
    emoji: () => <EmojiIcon>📸</EmojiIcon>,
  },
}

export const getCheckoutStatusProps = (document, status?: CheckoutStatus) => {
  const props = {
    CHECKED_OUT: {
      label: `Checked Out ${
        moment(document?.checkoutDate).format('MM/DD/YY') || ''
      }`,
      name: `Checked Out ${
        moment(document?.checkoutDate).format('MM/DD/YY') || ''
      }`,
      color: 'danger',
      title: 'Items have been checked out',
      tone: 'critical',
      icon: () => <EmojiIcon>🟥</EmojiIcon>,
    },
    RETURNED: {
      label: `Returned ${
        moment(document?.returnDate).format('MM/DD/YY') || ''
      }`,
      name: `Returned ${moment(document?.returnDate).format('MM/DD/YY') || ''}`,
      color: 'success',
      title: 'Items have been returned successfully',
      tone: 'positive',
      icon: () => <EmojiIcon>🟦</EmojiIcon>,
    },
    PENDING: {
      label: 'Begin Checkout',
      name: 'Pending',
      color: 'primary',
      title: 'This item is available to be checked out',
      tone: 'primary',
      icon: () => <EmojiIcon>✋</EmojiIcon>,
    },
    USER_NEEDED: {
      label: 'Select User',
      name: 'Select User',
      color: 'caution',
      title: 'Please select a user before checking this item out',
      tone: 'caution',
      icon: () => <EmojiIcon>👤</EmojiIcon>,
      disabled: true,
    },
    ITEMS_NEEDED: {
      label: 'Select Items',
      name: 'Select Items',
      color: 'caution',
      title:
        'Please select at least 1 inventory item before processing the checkout',
      tone: 'caution',
      icon: () => <EmojiIcon>📸</EmojiIcon>,
      disabled: true,
    },
    NO_STOCK: {
      label: 'No Stock',
      name: 'No Stock',
      color: 'caution',
      title: 'This item is out of stock',
      tone: 'caution',
      icon: EmojiIcon({ children: '🟥' }),
      disabled: true,
    },
    SPOTCHECK_NEEDED: {
      label: 'Spotcheck Needed',
      name: 'Spotcheck Needed',
      color: 'caution',
      title: 'Please spotcheck this item before processing the return',
      tone: 'caution',
      icon: EmojiIcon({ children: '⋯' }),
      disabled: true,
    },
  }

  if (!status) {
    status = getCheckoutStatus(document)
  } else {
    return props[status]
  }

  return props[status]
}
