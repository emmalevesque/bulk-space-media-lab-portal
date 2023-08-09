import { Flex, Box, Card } from '@sanity/ui'
import { log } from 'console'
import { Id, PreviewProps, defineType } from 'sanity'

type Category = {
  _id: Id
  title: string
  slug: string
  children: {
    _type: 'category'
    _ref: string
  }[]
  tags: {
    _type: 'tag'
    _ref: string
  }[]
}

type CategoryPreviewProps = PreviewProps &
  Category & {
    childrenLength: number
    childrenNames: string
  }

const CategoryPreview = (props: CategoryPreviewProps) => {
  const { childrenLength, childrenNames } = props

  const subtitle = childrenLength
    ? `${childrenLength} children: ${childrenNames}`
    : undefined

  return (
    <Flex align="center" direction={'row'}>
      {/* Customize the subtitle for the built-in preview */}
      <Box flex={1} paddingY={1}>
        {props.renderDefault({ ...props, subtitle })}
      </Box>
      <Box flex={1} padding={2}>
        {childrenLength}
      </Box>
    </Flex>
  )
}

// create a sanity schema type for a basic category in typescript
export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Category Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'children',
      title: 'Children Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
    {
      name: 'tags',
      title: 'Category Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      children: 'children',
    },
    prepare({ title, children }) {
      return {
        title,
        subtitle: `${children?.length} subpages`,
      }
    },
  },
})
