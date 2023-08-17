// @ts-nocheck
import { Box, Flex, Card, Text } from '@sanity/ui'
import { groq } from 'next-sanity'

import { useState, useEffect, useMemo } from 'react'
import {
  Id,
  PreviewProps,
  useClient,
  LoadableState,
  useDocumentValues,
} from 'sanity'

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

type CategoryPreviewProps = PreviewProps & Category

const useChildCategories = (children: CategoryPreviewProps['children']) => {
  const [childCategories, setChildCategories] = useState<Category[]>([])
  const client = useClient({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2021-03-25',
  })

  useEffect(() => {
    const fetchChildren = async () => {
      const result: Category[] = await client.fetch(
        groq`
        *[_id in $ids][]{
          _id,
          title,
          slug
        }
      `,
        { ids: children.map((child) => child._ref) }
      )
      setChildCategories(result)
    }

    fetchChildren()
  }, [children, client])

  return useMemo(() => childCategories, [])
}

export function CategoryPreview(props: CategoryPreviewProps) {
  const {
    isLoading,
    error,
    value,
  }: LoadableState<CategoryPreviewProps | undefined> = useDocumentValues(
    props._id,
    ['children']
  )

  const childCategories = useChildCategories(value?.children || [])

  const renderChildCategories = (childCategories as Category[]).map(
    (childCategory: Category) => {
      return (
        <Box key={childCategory._id} paddingY={1}>
          <Text>{childCategory.title}</Text>
        </Box>
      )
    }
  )

  return (
    <Flex align="center">
      {/* Customize the subtitle for the built-in preview */}
      <Box flex={1} paddingY={1}>
        {props.renderDefault({ ...props })}
        <Card padding={2}>{renderChildCategories}</Card>
      </Box>
    </Flex>
  )
}
