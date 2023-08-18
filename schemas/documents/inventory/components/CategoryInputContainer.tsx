import { Card, Box } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'
import { Reference, Slug } from 'sanity'
import { useCategoryTree } from '../hooks/useCategoryTree'
import { CategoryInputCheckbox } from './CategoryInputCheckbox'
import { useCategoryInputContext } from '../hooks/useCategoryInputContext'
import { useCallback, useEffect } from 'react'
import { uuid } from '@sanity/uuid'

export type CategoryInputContainerProps = SanityDocument & {
  slug: Slug
  title: string
  children?: CategoryInputContainerProps[]
  _key?: string
  isActive?: boolean
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function CategoryInputContainer({
  _id,
  title,
  slug,
  children,
}: CategoryInputContainerProps) {
  // create state for this parent category

  const { value, onChange, set, unset } = useCategoryInputContext()

  const handleChange = useCallback(
    (event) => {
      const isInCategory = value?.some((item) => item._ref === event.target.id)

      onChange(
        !isInCategory
          ? set(
              value
                ? [...value, { _key: uuid(), _ref: event.target.id }]
                : [{ _key: uuid(), _ref: event.target.id }]
            )
          : set(value?.filter((item) => item._ref !== event.target.id))
      )
    },
    [onChange, value, set]
  )

  return (
    <Box>
      {/* Parent Categories */}
      {Array.isArray(children) ? (
        <CategoryInputCheckbox
          id={_id}
          label={`${title} (${children.length})`}
          slug={slug.current}
          childCategories={children}
          onClick={handleChange}
        />
      ) : (
        <Card tone="default">
          <CategoryInputCheckbox
            id={_id}
            label={title}
            slug={slug.current}
            onClick={handleChange}
          />
        </Card>
      )}
    </Box>
  )
}
