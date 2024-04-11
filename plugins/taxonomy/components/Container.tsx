import { Box } from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import { SanityDocumentStub } from 'next-sanity'
import { ChangeEvent, useCallback } from 'react'
import { CheckboxComponent } from './Checkbox'
import { useTaxonomy } from '../hooks/useTaxonomy'
import { Category } from 'schemas/documents/inventory/category'

export type ContainerProps = Category & {
  _id: string
  name: string
  children?: (ContainerProps | Category)[]
  categories?: (Category | ContainerProps)[] | []
  _key?: string
  isActive?: boolean
  onClick?: () => void
}

/**
 * Renders a container component for the category input.
 */
export default function Container({
  _id,
  name,
  slug,
  categories,
  children,
}: ContainerProps) {
  const { value, onChange, set } = useTaxonomy()

  // handle the click event on the input checkbox
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isSelected = value?.some((item) => item._ref === event.target.id)
      const hasChildren = categories ? categories?.length > 0 : false
      const childrenAreSelected = isSelected
        ? value?.some((item) =>
            categories?.some(
              (child: { _ref: string }) => child?._ref === item._ref
            )
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
                  !categories?.some(
                    (child) => (child as SanityDocumentStub)?._id === item._ref
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
    [onChange, value, set, categories]
  )

  return (
    <Box>
      {/* If there are children append the count
       * to the category name so the user knows too */}
      {Array.isArray(children) && children.length > 0 ? (
        <CheckboxComponent
          id={_id}
          label={`${name} (${children?.length})`}
          childCategories={children}
          slug={slug}
          onClick={handleChange}
        />
      ) : (
        <CheckboxComponent
          id={_id}
          label={name}
          onClick={handleChange}
          slug={''}
        />
      )}
    </Box>
  )
}
