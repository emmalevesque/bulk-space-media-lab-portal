import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import contactInformation from 'schemas/objects/contact'

export default defineType({
  name: 'staff',
  title: 'Staff',
  type: 'document',
  icon: () => <EmojiIcon>🫂</EmojiIcon>,
  groups: [
    {
      name: 'contact',
      default: true,
    },
    {
      name: 'photo',
    },
  ],
  fields: [
    {
      group: 'contact',
      name: 'contact',
      title: 'Contact Information',
      type: 'contact',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      contact: 'contact',
      subtitle: 'contactInformation.email',
      media: 'photo',
    },
    prepare({ contact, subtitle, media }) {
      return {
        title: `${contact?.name?.first} ${contact?.name?.last}`,
        subtitle,
        media,
      }
    },
  },
})
