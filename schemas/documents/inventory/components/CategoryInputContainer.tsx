import { Card, Box } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'
import { Reference, Slug } from 'sanity'
import { useCategoryTree } from '../hooks/useCategoryTree'
import { CategoryInputCheckbox } from './CategoryInputCheckbox'
import { useCategoryInputContext } from '../hooks/useCategoryInputContext'
import { useCallback, useEffect } from 'react'

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

      // TODO: refactor to move all logic in handle change
      if (isInCategory) {
        onChange(
          !isInCategory
            ? set(value?.filter((item) => item._ref !== event.target.id))
            : unset()
        )
      } else {
        onChange(
          !isInCategory
            ? set(
                value
                  ? [...value, { _key: event.target.id, _ref: event.target.id }]
                  : [{ _key: event.target.id, _ref: event.target.id }]
              )
            : unset()
        )
      }
    },
    [onChange, value, set, unset]
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
          <CategoryInputCheckbox id={_id} label={title} slug={slug.current} />
        </Card>
      )}
    </Box>
  )
}
