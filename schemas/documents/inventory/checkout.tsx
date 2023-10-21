import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import dynamic from 'next/dynamic'
import CheckoutPreview from 'schemas/components/preview/CheckoutPreview'
import { getCheckoutStatus, getCheckoutStatusProps } from './hooks/useInventory'

const dev = process.env.NODE_ENV !== 'production'

const QrScanner = dynamic(() => import('./components/QrScanner'), {
  ssr: false,
})

// TODO: add hot and cold feature (hot means checked out, cold means returned)

// TODO: create a guided checkout flow and add custom actions to the "publish" menu that remaps Publish to Checkout
//     and adds a "Return" button to the checkout document

// TODO: move qrScanner into a modal'

export type CheckoutStatus =
  | 'SPOTCHECK_NEEDED'
  | 'PENDING'
  | 'CHECKED_OUT'
  | 'RETURNED'

export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
  validation: (Rule) => {
    return Rule.custom((document) => {
      const checkoutStatus = getCheckoutStatus(document)

      if (!checkoutStatus) return true

      if (checkoutStatus === 'SPOTCHECK_NEEDED') {
        return getCheckoutStatusProps(checkoutStatus, document).title
      } else if (checkoutStatus === 'PENDING') {
        return true
      } else {
        return true
      }
    })
  },
  icon: () => <EmojiIcon>📦</EmojiIcon>,
  groups: [
    {
      name: 'details',
      default: true,
    },
    {
      name: 'dates',
    },
    {
      name: 'spotCheck',
    },
    {
      name: 'status',
    },
    {
      name: 'notes',
    },
  ],
  fields: [
    {
      group: 'status',
      readOnly: true,
      name: 'isCheckedOut',
      title: 'Item is Checked Out?',
      description:
        'This field is handled autotically when processing a checkout.',
      type: 'boolean',
      hidden: !dev,
    },
    {
      group: 'status',
      readOnly: true,
      name: 'isReturned',
      title: 'Item is Returned?',
      description:
        'This field is handled autotically when processing a checkout.',
      type: 'boolean',
      hidden: !dev,
    },
    // TODO: confirm this feature or deprecate it
    {
      group: 'spotCheck',
      name: 'isSpotChecked',
      title: 'Has this item been Spot Checked?',
      description:
        'All items must be spot-checked before being return can be processed.',
      type: 'boolean',
      readOnly: ({ document }) => Boolean(document?.isCheckedOut),
    },
    {
      group: 'details',
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
      components: {
        input: QrScanner,
      },
    },
    {
      group: 'details',
      // TODO: rename this to items
      name: 'checkoutItems',
      title: 'Inventory Items',
      type: 'array',
      validation: (Rule) => Rule.min(1).required(),
      components: {
        input: QrScanner,
      },
      of: [
        {
          type: 'reference',
          weak: true,
          to: [{ type: 'item' }],
          options: {
            filter: () => {
              return {
                filter: 'stock > 0',
              }
            },
          },
        },
      ],
    },
    {
      group: 'dates',
      name: 'checkoutDate',
      title: 'Checkout Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      group: 'dates',
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
    },
    {
      name: 'notes',
      title: 'Checkout Notes',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'notes',
    },
  ],
  preview: {
    select: {
      checkedOutTo: 'user.name',
      checkoutDate: 'checkoutDate',
      returnDate: 'returnDate',
      spotChecked: 'spotChecked',
      isCheckedOut: 'isCheckedOut',
      isReturned: 'isReturned',
    },
    prepare(selection) {
      const { checkedOutTo, isCheckedOut, isReturned } = selection

      const status = getCheckoutStatus(selection)
      const statusProps = getCheckoutStatusProps(status, selection)

      console.log({ status, statusProps })

      return {
        title: checkedOutTo || 'No user selected yet',
        subtitle: getCheckoutStatusProps(status, selection).label,
        media: () => (
          <EmojiIcon>
            {!isCheckedOut && !isReturned
              ? `📦`
              : isCheckedOut && !isReturned
              ? `🟥`
              : `✅`}
          </EmojiIcon>
        ),
      }
    },
  },
  initialValue: {
    isCheckedOut: false,
    isReturned: false,
    isSpotChecked: false,
  },
  components: {
    item: CheckoutPreview,
    preview: CheckoutPreview,
  },
  orderings: [
    {
      title: 'Checkout Date',
      name: 'checkoutDateDesc',
      by: [{ field: 'checkoutDate', direction: 'desc' }],
    },
    {
      title: 'Return Date',
      name: 'returnDateDesc',
      by: [{ field: 'returnDate', direction: 'desc' }],
    },
    {
      title: 'User',
      name: 'userAsc',
      by: [{ field: 'user.name', direction: 'asc' }],
    },
    {
      title: 'User',
      name: 'userDesc',
      by: [{ field: 'user.name', direction: 'desc' }],
    },
  ],
})
