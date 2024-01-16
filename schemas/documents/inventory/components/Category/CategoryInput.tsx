import { Box, Button, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/LoadingOverlay'
import { groq } from 'next-sanity'
import { useCallback } from 'react'
import { set, unset, useClient } from 'sanity'
import useSWR from 'swr'
import { CategoryInputContextProvider } from '../../hooks/useCategoryInputContext'
import CategoryInputContainer from './CategoryInputContainer'

export const childrenQuery = (childQuery) => groq`
      "children": 
        *[_type == "category" 
        && defined(parent) 
        && parent._ref == ^._id
      ][] 
      | order(name asc)
      {
      ...,
      ${childQuery} 
      }
`

export const CategoryInputComponent = (props) => {
  const { value, onChange, schemaType } = props

  const client = useClient()

  const fetcher = (query, params?: any) => client.fetch(query, params)

  // TODO: add search filtering feature
  const { data, isLoading, error } = useSWR(
    [
      groq`*[!defined(parent) && _type == "category" && !(_id in path("drafts.**"))][]{
        ...,
        "_key": _id,
      //  look into why i passed an empty string here
       ${childrenQuery(childrenQuery(''))} 
      } | order(name asc)`,
    ],
    fetcher
  )

  const handleReset = useCallback(() => {
    onChange(Array.isArray(value) ? unset() : null)
  }, [onChange, value])

  if (isLoading && !data) return <LoadingOverlay />

  if (error) throw new Error(error)

  return data ? (
    <CategoryInputContextProvider
      value={{
        value,
        onChange,
        schemaType,
        set,
        unset,
      }}
    >
      <Inline>
        <Button padding={4} onClick={handleReset}>
          Reset
        </Button>
      </Inline>
      <Box>
        {data.map((category) => (
          <CategoryInputContainer
            childrenCategories={category.children}
            slug={category.slug}
            {...category}
            key={category._key}
            category={category}
          />
        ))}
      </Box>
    </CategoryInputContextProvider>
  ) : (
    <LoadingOverlay />
  )
}
