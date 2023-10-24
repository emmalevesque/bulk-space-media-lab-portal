import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import { getCheckoutStatusProps } from './hooks/useCheckout'
import ArrayQrCodeScanner from './components/QrCode/ArrayQrCodeScanner'
import ReferenceQrCodeScanner from './components/QrCode/ReferenceQrCodeScanner'

const dev = process.env.NODE_ENV !== 'production'

// TODO: create a guided checkout flow and add custom actions to the "publish" menu that remaps Publish to Checkout
//     and adds a "Return" button to the checkout document

// TODO: move qrScanner into a modal'

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
      readOnly: ({ document }) => Boolean(!document?.isCheckedOut),
    },
    {
      group: 'details',
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
      components: {
        input: ReferenceQrCodeScanner,
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
        input: ArrayQrCodeScanner,
      },
      of: [
        {
          type: 'reference',
          weak: true,
          to: [{ type: 'item' }],
          options: {
            filter: () => {
              return {
                filter: 'order(stock desc)',
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
      name: 'scheduledReturnDate',
      title: 'Scheduled Return Date',
      type: 'datetime',
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
      checkoutItems: 'checkoutItems',
      checkedOutTo: 'user.name',
      checkoutDate: 'checkoutDate',
      returnDate: 'returnDate',
      isSpotChecked: 'isSpotChecked',
      isCheckedOut: 'isCheckedOut',
      isReturned: 'isReturned',
      user: 'user',
    },
    prepare(selection) {
      const props = getCheckoutStatusProps(selection)
      return {
        title: selection.checkedOutTo,
        subtitle: props?.name,
        media: props?.icon,
      }
    },
  },

  initialValue: {
    isCheckedOut: false,
    isReturned: false,
    isSpotChecked: false,
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
