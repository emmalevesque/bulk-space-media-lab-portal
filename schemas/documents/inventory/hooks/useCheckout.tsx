import {
  CheckmarkCircleIcon,
  EllipsisHorizontalIcon,
  IconComponent,
  UserIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import { CardTone } from '@sanity/ui'
import EmojiIcon from 'components/Icon/Emoji'
import moment from 'moment'
import { SanityDocument } from 'next-sanity'
import type { ItemType } from '../item'

export type CheckoutStatus =
  // add Pre & Post spotcheck
  | 'LOADING' // await document info
  | 'CHECKED_OUT' // spotcheck needed
  | 'RETURNED' // complete
  | 'USER_NEEDED'
  | 'ITEMS_NEEDED'
  | 'NO_STOCK' // ready
  | 'PENDING' // ready
  | 'DEFAULT' // ready

export type CheckoutType = SanityDocument & {
  _type: 'checkout'
  isCheckedOut: boolean
  isReturned: boolean
  staffMember: {
    _type: 'reference'
    _ref: string
  }
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
  const isStaffCheckout = document?.isStaffCheckout
  const staffMember = document?.staffMember?._ref

  if (document) {
    if (isReturned) {
      return 'RETURNED'
    }

    if (isCheckedOut) {
      return 'CHECKED_OUT'
    }

    if (
      checkoutItems?.filter((item) => !Boolean(item?._ref))?.length > 0 &&
      (user || (staffMember && isStaffCheckout)) &&
      !isCheckedOut &&
      !isReturned
    ) {
      return 'PENDING'
    }

    if (isStaffCheckout && !staffMember) {
      return 'USER_NEEDED'
    }

    if (!isStaffCheckout && !user) {
      return 'USER_NEEDED'
    }

    if (!checkoutItems?.length) {
      return 'ITEMS_NEEDED'
    }

    return 'PENDING'
  }

  return 'LOADING'
}

export const checkoutActions: {
  [key in CheckoutStatus]: {
    label: string
    name?: string
    title: string
    tone: CardTone
    color: 'primary' | 'warning' | 'success' | 'danger' | 'default'
    icon?: IconComponent
    disabled?: boolean
    emoji: () => React.ReactNode
  }
} = {
  PENDING: {
    label: 'Begin Checkout',
    name: 'Pending',
    title: 'This checkout is pending and ready to be checked out',
    tone: 'positive',
    color: 'success',
    icon: EllipsisHorizontalIcon,
    emoji: () => <EmojiIcon>⋯</EmojiIcon>,
  },
  NO_STOCK: {
    label: 'No Stock',
    color: 'danger',
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
    name: 'Checked Out',
    color: 'danger',
    title: 'This is currently checked out',
    tone: 'caution',
    icon: EllipsisHorizontalIcon,
    emoji: () => (
      <div className="flex rounded-full border-2 border-red-600"></div>
    ),
  },
  RETURNED: {
    label: 'Checkout Complete',
    name: 'Returned',
    color: 'primary',
    title: 'This has been returned',
    tone: 'positive',
    icon: CheckmarkCircleIcon,
    disabled: true,
    emoji: () => (
      <div className="flex rounded-full border-2 border-green-400"></div>
    ),
  },
  USER_NEEDED: {
    label: 'Select User',
    name: 'User Needed',
    color: 'warning',
    title: 'Please select a user before checking this item out',
    tone: 'caution',
    icon: UserIcon,
    disabled: true,
    emoji: () => <EmojiIcon>👤</EmojiIcon>,
  },
  ITEMS_NEEDED: {
    label: 'Select Items',
    name: 'Items Needed',
    color: 'warning',
    title: 'Please select inventory items before checking this item out',
    tone: 'caution',
    disabled: true,
    emoji: () => <EmojiIcon>📸</EmojiIcon>,
  },
  LOADING: {
    label: 'Loading',
    name: 'Loading',
    color: 'warning',
    title: 'Loading',
    tone: 'default',
    icon: EllipsisHorizontalIcon,
    disabled: true,
    emoji: () => <EmojiIcon>⋯</EmojiIcon>,
  },
  DEFAULT: {
    label: 'Setup Checkout',
    name: 'Setup Checkout',
    color: 'warning',
    title: 'Fill out the form to begin the checkout process',
    tone: 'caution',
    icon: EllipsisHorizontalIcon,
    emoji: () => (
      <div className="flex rounded-full border-2 border-amber-400"></div>
    ),
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
      color: 'positive',
      title: 'This item is available to be checked out',
      tone: 'positive',
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

  if (!status && document) {
    status = getCheckoutStatus(document)
  } else if (status) {
    return props[status]
  } else if (!status) {
    return props['LOADING']
  }

  return props[status]
}
