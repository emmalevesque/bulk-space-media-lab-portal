import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import dynamic from 'next/dynamic'
import CheckoutPreview from 'schemas/components/preview/CheckoutPreview'

const dev = process.env.NODE_ENV !== 'production'

const QrScanner = dynamic(() => import('./components/QrScanner'), {
  ssr: false,
})

// TODO: add hot and cold feature (hot means checked out, cold means returned)

// TODO: create a guided checkout flow and add custom actions to the "publish" menu that remaps Publish to Checkout
//     and adds a "Return" button to the checkout document

// TODO: move qrScanner into a modal'

export type CheckoutStatus = 'READY' | 'CHECKED_OUT' | 'RETURNED'

export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
  icon: () => <EmojiIcon>📦</EmojiIcon>,
  groups: [
    {
      name: 'status',
    },
    {
      name: 'items',
    },
    {
      name: 'dates',
    },
    {
      name: 'people',
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
      validation: (Rule) =>
        Rule.custom(
          (value, context) =>
            value === true ||
            'Item must be spot checked before it can be checked out.'
        ),
    },
    {
      group: 'people',
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      components: {
        input: QrScanner,
      },
    },
    {
      group: 'items',
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
          options: {
            filter: ({ document }) => {
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
  ],
  preview: {
    select: {
      checkedOutTo: 'user.name',
      checkoutDate: 'checkoutDate',
      returnDate: 'returnDate',
      isCheckedOut: 'isCheckedOut',
    },
    prepare(selection) {
      const { checkedOutTo, checkoutDate, returnDate, isCheckedOut } = selection
      return {
        title: checkedOutTo || 'No user selected yet',
        subtitle: isCheckedOut ? `Checked Out` : 'Checked In',
        media: () => <EmojiIcon>{isCheckedOut ? `🟥` : `✅`}</EmojiIcon>,
      }
    },
  },
  initialValue: {
    isCheckedOut: false,
    isReturned: false,
    spotChecked: false,
  },
  components: {
    preview: CheckoutPreview,
  },
})
