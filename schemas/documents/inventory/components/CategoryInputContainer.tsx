import { Card, Box } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'
import { Slug, useClient } from 'sanity'
import { CategoryInputCheckbox } from './CategoryInputCheckbox'
import { useCategoryInputContext } from '../hooks/useCategoryInputContext'
import { SyntheticEvent, useCallback } from 'react'
import { uuid } from '@sanity/uuid'
import { Category } from '../category'

export type CategoryInputContainerProps = SanityDocument & {
  slug: Slug
  title: string
  children?: CategoryInputContainerProps[]
  childrenCategories?: Category[] | []
  _key?: string
  isActive?: boolean
  onClick: (event: SyntheticEvent<HTMLInputElement>) => void
}

export default function CategoryInputContainer({
  _id,
  title,
  slug,
  childrenCategories,
  children,
}: CategoryInputContainerProps) {
  const { value, onChange, set, unset } = useCategoryInputContext()

  // instantiate the client

  // handle the click event on the input checkbox
  const handleChange = useCallback(
    (event) => {
      const isSelected = value?.some((item) => item._ref === event.target.id)
      const hasChildren = childrenCategories
        ? childrenCategories?.length > 0
        : false
      const childrenAreSelected = value?.some((item) =>
        childrenCategories?.some((child) => child._id === item._ref)
      )

      // Current category is being selected
      if (!isSelected) {
        onChange(
          set([...(value || []), { _key: uuid(), _ref: event.target.id }])
        )
      } else {
        // Current category is being deselected
        if (hasChildren && childrenAreSelected) {
          // Deselect all child categories
          onChange(
            set(
              value?.filter(
                (item) =>
                  !childrenCategories?.some(
                    (child) => child._id === item._ref
                  ) && item._ref !== event.target.id
              )
            )
          )
        } else {
          // Only deselect the current category
          onChange(set(value?.filter((item) => item._ref !== event.target.id)))
        }
      }
    },
    [onChange, value, set, childrenCategories]
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
