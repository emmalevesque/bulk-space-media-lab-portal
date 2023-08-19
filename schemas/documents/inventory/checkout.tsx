import { Card } from '@sanity/ui'
import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import QrScanner from './components/QrScanner'

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
      type: 'reference',
      to: [{ type: 'user' }],
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
