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
  scheduledReturnDate: string
  returnDate?: string
  notes?: {
    _type: 'block'
    children: {
      _type: 'span'
      text: string
    }[]
  }[]
}
export const getCheckoutStatus = (document: CheckoutType): CheckoutStatus => {
  const isCheckedOut = document?.isCheckedOut
  const isReturned = document?.isReturned
  const user = document?.user
  const checkoutItems = document?.checkoutItems

  if (!isCheckedOut) {
    if (!user && !document?.isStaffCheckout) {
      return 'USER_NEEDED'
    } else if (!Array.isArray(checkoutItems) || !checkoutItems[0]?._ref) {
      return 'ITEMS_NEEDED'
    }
    // check the stock of each item in the checkout
  }

  if (isCheckedOut && isReturned) {
    return 'RETURNED'
  } else if (isCheckedOut && !isReturned) {
    return 'CHECKED_OUT'
  } else if (!isCheckedOut && !isReturned) {
    return 'PENDING'
  }

  return 'PENDING'
}

export const checkoutActions = {
  NEW: {
    label: 'Begin Checkout',
    color: 'primary',
    title: 'Checkout is ready to begin',
    tone: 'primary',
    icon: EllipsisHorizontalIcon,
    emoji: AddIcon,
  },
  PENDING: {
    label: 'Begin Checkout',
    color: 'primary',
    title: 'This checkout is pending and ready to be checked out',
    tone: 'primary',
    icon: EllipsisHorizontalIcon,
    emoji: () => <EmojiIcon>⋯</EmojiIcon>,
  },
  NO_STOCK: {
    label: 'No Stock',
    color: 'caution',
    title: 'This is out of stock',
    tone: 'caution',
    icon: WarningOutlineIcon,
    disabled: true,
    emoji: () => (
      <div className="flex rounded-full border-2 border-red-600"></div>
    ),
  },

  CHECKED_OUT: {
    label: 'Process Return',
    color: 'primary',
    title: 'This is currently checked out',
    tone: 'caution',
    icon: EllipsisHorizontalIcon,
    emoji: () => (
      <div className="flex rounded-full border-2 border-red-600"></div>
    ),
  },
  RETURNED: {
    label: 'Checkout Complete',
    color: 'success',
    title: 'This has been returned',
    tone: 'positive',
    icon: CheckmarkCircleIcon,
    disabled: true,
    emoji: () => (
      <div className="flex rounded-full border-2 border-blue-400"></div>
    ),
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
      icon: () => (
        <div className="flex rounded-full border-2 border-red-600"></div>
      ),
    },
    RETURNED: {
      label: `Returned ${
        moment(document?.returnDate).format('MM/DD/YY') || ''
      }`,
      name: `Returned ${moment(document?.returnDate).format('MM/DD/YY') || ''}`,
      color: 'success',
      title: 'Items have been returned successfully',
      tone: 'positive',
      icon: () => (
        <div className="flex rounded-full border-2 border-blue-400"></div>
      ),
    },
    PENDING: {
      label: 'Begin Checkout',
      name: 'Pending',
      color: 'primary',
      title: 'This item is available to be checked out',
      tone: 'primary',
      icon: () => (
        <div className="flex rounded-full border-2 border-green-400"></div>
      ),
    },
    USER_NEEDED: {
      label: 'Select User',
      name: 'Select User',
      color: 'caution',
      title: 'Please select a user before checking this item out',
      tone: 'caution',
      icon: () => (
        <div className="flex rounded-full border-2 border-amber-400"></div>
      ),
      disabled: true,
    },
    ITEMS_NEEDED: {
      label: 'Select Items',
      name: 'Select Items',
      color: 'caution',
      title:
        'Please select at least 1 inventory item before processing the checkout',
      tone: 'caution',
      icon: () => (
        <div className="flex rounded-full border-2 border-amber-400"></div>
      ),
      disabled: true,
    },
    NO_STOCK: {
      label: 'No Stock',
      name: 'No Stock',
      color: 'caution',
      title: 'This item is out of stock',
      tone: 'caution',
      icon: () => (
        <div className="flex rounded-full border-2 border-red-600"></div>
      ),
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
