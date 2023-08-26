import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/LoadingOverlay'
import { groq } from 'next-sanity'
import { Reference, useClient } from 'sanity'
import useSWR from 'swr'
import { childrenQuery } from 'tools/Navigation/NavigationStructure'
import CategoryInputContainer from './CategoryInputContainer'
import { CategoryInputContextProvider } from '../hooks/useCategoryInputContext'
import { set, unset } from 'sanity'

// TODO: remove if not needed
const getCategoryNames = async (ids) => {
  const client = useClient()

  const query = groq`*[defined(categories) && categories[]._ref in $ds][]`

  const params = {
    ids,
  }

  const data = await client.fetch(query, params)

  return data?.title
}

export const CategoryInputComponent = (props) => {
  const { value, onChange, schemaType } = props

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

  const handleReset = useCallback(() => {
    onChange(Array.isArray(value) ? unset() : null)
  }, [onChange])

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
