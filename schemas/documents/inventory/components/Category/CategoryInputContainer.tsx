import { Box, Card } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import { SanityDocument } from 'next-sanity'
import { ChangeEvent, useCallback } from 'react'
import { Slug } from 'sanity'
import { useCategoryInputContext } from '../../hooks/useCategoryInputContext'
import { CategoryInputCheckbox } from './CategoryInputCheckbox'

export type CategoryInputContainerProps = SanityDocument & {
  slug: Slug
  name: string
  children?: CategoryInputContainerProps[]
  childrenCategories?: CategoryInputContainerProps[] | []
  _key?: string
  isActive?: boolean
  onClick: () => void
}

export default function CategoryInputContainer({
  _id,
  name,
  slug,
  childrenCategories,
  children,
}: CategoryInputContainerProps) {
  const { value, onChange, set } = useCategoryInputContext()

  // instantiate the client

  // handle the click event on the input checkbox
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isSelected = value?.some((item) => item._ref === event.target.id)
      const hasChildren = childrenCategories
        ? childrenCategories?.length > 0
        : false
      const childrenAreSelected = isSelected
        ? value?.some((item) =>
            childrenCategories?.some((child) => child?._id === item._ref)
          )
        : false

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
          label={`${name} (${children.length})`}
          slug={slug?.current}
          childCategories={children}
          onClick={handleChange}
        />
      ) : (
        <Card tone="default">
          <CategoryInputCheckbox
            id={_id}
            label={name}
            slug={slug?.current}
            onClick={handleChange}
          />
        </Card>
      )}
    </Box>
  )
}
