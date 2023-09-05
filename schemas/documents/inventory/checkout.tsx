import { Card } from '@sanity/ui'
import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import dynamic from 'next/dynamic'

const QrScanner = dynamic(() => import('./components/QrCode/QrScanner'), {
  ssr: false,
})

// TODO: add hot and cold feature (hot means checked out, cold means returned)

// TODO: patch the inventory of item when checkout is created?
// TODO: create a guided checkout flow and add custom actions to the "publish" menu that remaps Publish to Checkout
//     and adds a "Return" button to the checkout document

// TODO: add qr code scan for items and users
export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
  icon: () => <EmojiIcon>📦</EmojiIcon>,
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'array',
      of: [
        {
          weak: true,
          type: 'reference',
          to: [{ type: 'user' }],
        },
      ],
      components: {
        input: QrScanner,
      },
    },
    {
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
          to: [{ type: 'item' }, { type: 'kit' }],
        },
      ],
    },
    {
      name: 'checkoutDate',
      title: 'Checkout Date',
      type: 'datetime',
    },
    {
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
    },
    {
      name: 'returned',
      title: 'Item Returned',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'spotChecked',
      title: 'Item Spot Checked',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      checkedOutTo: 'user.name',
      checkoutDate: 'checkoutDate',
      returnDate: 'returnDate',
    },
    prepare(selection) {
      const { checkedOutTo, checkoutDate, returnDate } = selection
      return {
        title: checkedOutTo,
        subtitle: `${checkoutDate} - ${returnDate}`,
      }
    },
  },
})
