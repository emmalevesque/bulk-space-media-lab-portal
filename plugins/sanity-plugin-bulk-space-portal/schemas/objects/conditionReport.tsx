import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'conditionReport',
  title: 'Condition Report',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      initialValue: new Date().toISOString().split('T')[0],
      options: {
        dateFormat: 'MM/DD/YYYY',
      },
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'staff' }],
    }),
    defineField({
      name: 'report',
      title: 'Condition Report',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'rating',
      title: 'Condition Rating',
      type: 'number',
      description: '1 = Poor, 10 = Excellent',
      initialValue: 10,
      validation: (Rule) => [Rule.min(1), Rule.max(10)],
    }),
  ],
  preview: {
    select: {
      rating: 'rating',
    },
    prepare({ rating }) {
      return {
        title: `Condition Report`,
        subtitle: `Rating: ${rating}`,
      }
    },
  },
})
