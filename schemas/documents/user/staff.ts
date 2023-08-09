import { defineType } from 'sanity'

export default defineType({
  name: 'staff',
  title: 'Staff',
  type: 'document',
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
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'contactInformation',
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
})
