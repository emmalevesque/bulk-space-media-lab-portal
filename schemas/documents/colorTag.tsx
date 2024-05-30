import EmojiIcon from 'components/global/Icon/Emoji'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'colorTag',
  title: 'Color Tag',
  type: 'document',
  icon: () => <EmojiIcon>🎨</EmojiIcon>,
  fields: [
    defineField({
      name: 'title',
      title: 'Color Name',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'simplerColor',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare({ color, title }) {
      return {
        title,
        media: () => {
          console.log({ color })

          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: color.value,
              }}
            ></div>
          )
        },
      }
    },
  },
})
