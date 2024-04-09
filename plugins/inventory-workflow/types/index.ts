import { SanityDocument } from 'next-sanity'
import { ItemStates } from 'plugins/inventory-workflow/hooks/hooks/useInventory'

export type ItemType = SanityDocument & {
  name: string
  manufacturerDetails: {
    make: string
    model: string
  }
  slug: {
    current: string
  }
  showMoreDetails: boolean
  sku: string
  description: string
  images: {
    asset: {
      _ref: string
    }
  }[]
  category: {
    title: string
    parent: {
      title: string
    }
  }
  stock: number
  productManualUrl: string
}

export type InventoryHook = {
  handleProcessCheckout: () => void
  itemAvailability: number
  relatedCheckouts: CheckoutType[] | null
  checkoutHistory: CheckoutType | null
  isPublishing: boolean
  // eslint-disable-next-line no-unused-vars
  setIsPublishing: (value: boolean) => void
  itemState: ItemState
  itemStateProps: (typeof ItemStates)[keyof typeof ItemStates]
}

export type ItemState = keyof typeof ItemStates

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
