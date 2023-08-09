import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactInformation',
  title: 'Contact Information',
  type: 'object',
  fields: [
    defineField({
      type: 'object',
      options: {
        columns: 2,
      },
      name: 'name',
      title: 'Name',
      fields: [
        {
          name: 'first',
          title: 'First',
          type: 'string',
        },
        {
          name: 'last',
          title: 'Last',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
      ],
    }),
  ],
})
