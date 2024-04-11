import { Box, Button, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/global/LoadingOverlay'
import { groq } from 'next-sanity'
import { useCallback } from 'react'
import { set, unset } from 'sanity'
import Container from './Container'
import { TaxonomyContextProvider } from '../hooks/useTaxonomy'
import { useListeningQuery } from 'sanity-plugin-utils'
import { childrenQuery } from './Input'
import { Category } from 'schemas/documents/inventory/category'

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
        ${childrenQuery(childrenQuery(''))} 
      } | order(count(childrenQuery) desc)`,
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
      <Inline>
        <Button padding={4} onClick={handleReset}>
          Reset
        </Button>
      </Inline>
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
    </TaxonomyContextProvider>
  ) : (
    <LoadingOverlay />
  )
}
