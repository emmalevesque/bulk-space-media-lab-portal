import { Checkbox, Inline, Stack } from '@sanity/ui'
import { CategoryChildren } from './CategoryChildren'
import { CategoryInputContainerProps } from './CategoryInputContainer'
import { useCategoryInputContext } from '../../../inventory-workflow/hooks/hooks/useCategoryInputContext'

type CategoryInputCheckboxProps = Partial<HTMLInputElement> & {
  id: string
  slug: string
  label: string
  onClick?: any
  childCategories?: CategoryInputContainerProps[] | undefined
}

export const CategoryInputCheckbox = ({
  id,
  slug,
  label,
  childCategories,
  onClick,
}: CategoryInputCheckboxProps) => {
  const { value = [] } = useCategoryInputContext()

  const isSelected = value ? value?.some((item) => item._ref === id) : false

  return (
    <Stack>
      <Inline space={2} paddingY={2}>
        <Checkbox id={id} checked={isSelected} onClick={onClick} />
        <label htmlFor={id}>{label}</label>
      </Inline>
      {Array.isArray(childCategories) ? (
        <CategoryChildren
          id={id}
          showChildren={isSelected}
          childCategories={childCategories}
          slug={slug}
        />
      ) : null}
    </Stack>
  )
}
