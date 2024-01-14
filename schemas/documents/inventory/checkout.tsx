import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import StaffMemberInput from 'schemas/components/StaffMemberInput'
import { getCheckoutStatusProps } from './hooks/useCheckout'

const dev = process.env.NODE_ENV !== 'production'

// TODO: create a guided checkout flow and add custom actions to the "publish" menu that remaps Publish to Checkout
//     and adds a "Return" button to the checkout document

// TODO: move qrScanner into a modal'

export default defineType({
  name: 'checkout',
  title: 'Checkout',
  type: 'document',
  icon: () => <EmojiIcon>🛒</EmojiIcon>,
  liveEdit: true,
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
      group: 'details',
      name: 'staffMember',
      title: 'Staff Member',
      description:
        'The staff member who is checking out this item. In most cases, this will be you.',
      type: 'reference',
      to: [{ type: 'staff' }],
      components: {
        input: StaffMemberInput,
      },
    },
    {
      group: 'details',
      name: 'isStaffCheckout',
      title: 'Is this a Staff Checkout?',
      description:
        'Staff checkouts are for internal use only and do not require a user.',
      type: 'boolean',
      initialValue: false,
    },
    {
      group: 'details',
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }, { type: 'staff' }],
      hidden: ({ document }) => Boolean(document?.isStaffCheckout),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context?.document?.isStaffCheckout) {
            return true
          } else {
            return value ? true : 'User is required'
          }
        }),
      components: {
        // input: ReferenceQrCodeScanner,
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
        // input: ArrayQrCodeScanner,
      },
      of: [
        {
          type: 'reference',
          weak: true,
          to: [{ type: 'item' }],
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
      isStaffCheckout: 'isStaffCheckout',
      staffMember: 'staffMember',
      staffMemberName: 'staffMember.displayName',
      user: 'user',
    },
    prepare(selection) {
      const props = getCheckoutStatusProps(selection)
      return {
        title: !selection?.isStaffCheckout
          ? selection.checkedOutTo
          : selection?.staffMemberName,
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
