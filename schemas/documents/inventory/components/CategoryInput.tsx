import { useCallback, useState } from 'react'
import { Box, Button, Inline } from '@sanity/ui'
import LoadingOverlay from 'components/LoadingOverlay'
import { groq } from 'next-sanity'
import { Reference, useClient } from 'sanity'
import useSWR from 'swr'
import { childrenQuery } from 'tools/Navigation/NavigationStructure'
import CategoryInputContainer from './CategoryInputContainer'
import { CategoryInputContextProvider } from '../hooks/useCategoryInputContext'
import { set, unset } from 'sanity'
import { uuid } from '@sanity/uuid'

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
        <Button onClick={() => onChange(Array.isArray(value) ? unset() : null)}>
          Reset
        </Button>
      </Inline>
      <Box>
        {data.map((category) => (
          <CategoryInputContainer
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
