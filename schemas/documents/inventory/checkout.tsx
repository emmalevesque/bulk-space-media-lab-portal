import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import dynamic from 'next/dynamic'
import CheckoutPreview from 'schemas/components/preview/CheckoutPreview'
import { checkoutStatuses, getCheckoutStatus } from './hooks/useInventory'

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
  | 'READY'
  | 'CHECKED_OUT'
  | 'RETURNED'

export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
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
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
      hidden: !dev,
    },
    {
      group: 'status',
      name: 'spotChecked',
      title: 'Item Spot Checked',
      type: 'boolean',
      readOnly: ({ document }) => Boolean(document?.isCheckedOut),
      validation: (Rule) =>
        Rule.custom(
          (value, context) =>
            value === true ||
            'Item must be spot checked before it can be checked out.'
        ),
    },
    {
      group: 'details',
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
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
      components: {
        input: QrScanner,
      },
      of: [
        {
          type: 'reference',
          weak: true,
          to: [{ type: 'item' }],
          validation: (Rule) => Rule.min(1).required(),
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

      return {
        title: checkedOutTo || 'No user selected yet',
        subtitle: checkoutStatuses[getCheckoutStatus(selection)].label,
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
    spotChecked: false,
  },
  components: {
    item: CheckoutPreview,
    preview: CheckoutPreview,
  },
})
