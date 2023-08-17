import { Box, Card, Heading, Stack, Text, TextInput } from '@sanity/ui'
import LoadingOverlay from 'components/LoadingOverlay'
import { groq } from 'next-sanity'
import { useClient } from 'sanity'
import useSWR from 'swr'
import { childrenQuery } from 'tools/Navigation/NavigationStructure'
import CategoryInputCheckbox from './CategoryInputContainer'

export const CategoryInputComponent = () => {
  const client = useClient()

  const fetcher = (query, params) => client.fetch(query, params)

  const { data, isLoading, error } = useSWR(
    [
      groq`*[_id == "menu"][0].categories[]->{
        ...,
        "_key": _id,
       ${childrenQuery(childrenQuery(''))} 
      } | order(title asc)`,
    ],
    fetcher
  )

  if (isLoading) return <LoadingOverlay />

  if (error) throw new Error(error)

  return data ? (
    <Box>
      {data.map((category) => (
        <CategoryInputCheckbox
          slug={category.slug}
          {...category}
          key={category._key}
          category={category}
        />
      ))}
    </Box>
  ) : (
    <LoadingOverlay />
  )
}
