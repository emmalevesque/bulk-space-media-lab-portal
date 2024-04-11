import { Box, Button, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/global/LoadingOverlay'
import { groq } from 'next-sanity'
import { useCallback } from 'react'
import { set, unset, useClient } from 'sanity'
import useSWR from 'swr'
import Container from './Container'
import { TaxonomyContextProvider } from '../hooks/useTaxonomy'
import { useListeningQuery } from 'sanity-plugin-utils'

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

  // TODO: add search filtering feature
  const { data, loading, error } = useListeningQuery(
    groq`*[!defined(parent) && _type == "category"][]{
        ...,
        "_key": _id,
      //  look into why i passed an empty string here
        ${childrenQuery(childrenQuery(''))} 
      } | order(name asc)`,
    {
      options: {
        perspective: 'previewDrafts',
      },
    }
  )

  const handleReset = useCallback(() => {
    onChange(Array.isArray(value) ? unset() : null)
  }, [onChange, value])

  if (loading && !data) return <LoadingOverlay />

  if (error) throw new Error('error')

  return data ? (
    <TaxonomyContextProvider
      value={{
        value,
        onChange,
        schemaType,
        set,
        unset,
      }}
    >
      <Inline></Inline>
      <Box>
        {Array.isArray(data) &&
          data.map((category) => (
            <Container
              childrenCategories={category.children}
              slug={category.slug}
              {...category}
              key={category._key}
              category={category}
            />
          ))}
        <Button mode="ghost" size={1} padding={4} onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </TaxonomyContextProvider>
  ) : (
    <LoadingOverlay />
  )
}
