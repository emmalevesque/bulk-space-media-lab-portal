import { Box, Button, Flex, Grid, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/global/LoadingOverlay'
import { groq } from 'next-sanity'
import { useCallback } from 'react'
import { set, unset } from 'sanity'
import Container from './Container'
import { TaxonomyContextProvider } from '../hooks/useTaxonomy'
import { useListeningQuery } from 'sanity-plugin-utils'
import { Category } from 'schemas/documents/inventory/category'

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

/**
 * Renders the main "categories" component
 */
export const TaxonomyComponent = (props) => {
  const { value, onChange, schemaType } = props

  // TODO: add search filtering feature
  const { data, loading, error } = useListeningQuery<Category[]>(
    groq`*[!defined(parent) && _type == "category"][]{
        ...,
        "_key": _id,
        ${childrenQuery(childrenQuery(''))},
      }
      | order(count(children) desc)`,
    {
      options: {
        perspective: 'previewDrafts',
        tag: 'taxonomy',
      },
    }
  )

  const handleReset = useCallback(() => {
    onChange(Array.isArray(value) ? unset() : null)
  }, [onChange, value])

  if (loading && !data) return <LoadingOverlay />

  if (error && !data) throw new Error('error')

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
      <Flex justify="space-between">
        {Array.isArray(data) && (
          <Box>
            {data.map((category) =>
              category ? (
                <Container
                  {...category}
                  categories={category.children || []}
                  key={category._key || category._id}
                />
              ) : null
            )}
          </Box>
        )}
        <Inline>
          <Button padding={4} size={1} mode="ghost" onClick={handleReset}>
            Clear
          </Button>
        </Inline>
      </Flex>
    </TaxonomyContextProvider>
  ) : (
    <LoadingOverlay />
  )
}
