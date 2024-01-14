import { PortableText } from '@portabletext/react'
import { Card, Stack, Text } from '@sanity/ui'
import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import {
  ReadableDatetime,
  useReadableDate,
} from 'schemas/components/ReadableDatetime'
import StaffMemberInput from 'schemas/components/StaffMemberInput'
import { CheckoutType, getCheckoutStatusProps } from './hooks/useCheckout'

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
      options: {
        dateFormat: 'MM/DD/yyyy',
        timeFormat: 'hh:mma',
        timeStep: 15,
      },
      initialValue: () => new Date().toISOString(),
      components: {
        input: ReadableDatetime,
      },
    },
    {
      group: 'dates',
      name: 'scheduledReturnDate',
      title: 'Scheduled Return Date',
      type: 'datetime',
      options: {
        dateFormat: 'MM/DD/yyyy',
        timeFormat: 'hh:mma',
        timeStep: 15,
      },
      initialValue: () => {
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        return nextWeek.toISOString()
      },
      components: {
        input: ReadableDatetime,
      },
      validation: (Rule) => {
        return Rule.custom((value, context) => {
          console.log({ value, context })

          if (!value || !context?.document) {
            return true
          }

          const document = context?.document

          const checkoutDate = context?.document?.checkoutDate
            ? new Date((context?.document as CheckoutType)?.checkoutDate)
            : new Date()
          const scheduledReturnDate = new Date(value as string)
          if (scheduledReturnDate < checkoutDate) {
            return 'Scheduled Return Date must be after Checkout Date'
          }
          return true
        })
      },
    },
    {
      group: 'dates',
      name: 'returnDate',
      title: 'Return Date',
      type: 'datetime',
      options: {
        dateFormat: 'MM/DD/yyyy',
        timeFormat: 'hh:mma',
        timeStep: 15,
      },
      components: {
        input: (props) => ReadableDatetime(props, { showTone: false }),
      },
    },
    {
      name: 'notes',
      title: 'Checkout Notes',
      type: 'array',
      of: [
        {
          type: 'object',
          components: {
            preview: (props, context) => {
              return (
                <Card
                  tone="caution"
                  className=" hover:cursor-pointer hover:saturate-200"
                  padding={2}
                >
                  <Stack space={2}>
                    <Text muted size={1}>
                      {new Date(props?.date).toLocaleDateString()} (
                      {useReadableDate(props?.date).readableDate})
                    </Text>
                    <span className=" text-sm">
                      <PortableText value={props?.note} />
                    </span>
                  </Stack>
                </Card>
              )
            },
          },
          preview: {
            select: {
              note: 'note',
              date: 'date',
            },
            prepare(selection) {
              return {
                title: selection?.date
                  ? new Date(selection?.date).toLocaleString()
                  : 'No Date',
                ...selection,
              }
            },
          },
          name: 'note',
          title: 'Note',
          fields: [
            {
              type: 'datetime',
              name: 'date',
              readOnly: true,
              title: 'Date',
              options: {
                dateFormat: 'MM/DD/yyyy',
                timeFormat: 'hh:mma',
                timeStep: 15,
              },
              initialValue: () => new Date().toISOString(),
              components: {
                input: ReadableDatetime,
              },
            },
            {
              type: 'array',
              of: [{ type: 'block' }],
              name: 'note',
              title: 'Note',
            },
          ],
        },
      ],
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
