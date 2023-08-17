import { Checkbox, Inline, Stack } from '@sanity/ui'
import { CategoryChildren } from './CategoryChildren'
import { CategoryInputContainerProps } from './CategoryInputContainer'
import { useCategoryInputContext } from '../hooks/useCategoryInputContext'

type CategoryInputCheckboxProps = Partial<HTMLInputElement> & {
  id: string
  slug: string
  label: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  childCategories?: CategoryInputContainerProps[] | undefined
}

export const CategoryInputCheckbox = ({
  id,
  slug,
  label,
  childCategories,
  onClick,
  checked,
}: CategoryInputCheckboxProps) => {
  const { onChange, set, unset, value } = useCategoryInputContext()

  return (
    <Stack>
      <Inline space={2} paddingY={2}>
        <Checkbox
          id={id}
          checked={value?.some((item) => item._ref === id) || false}
          onClick={onClick}
        />
        <label htmlFor={id}>{label}</label>
      </Inline>
      {Array.isArray(childCategories) ? (
        <CategoryChildren
          id={id}
          showChildren={value?.some((item) => item._ref === id) || false}
          childCategories={childCategories}
          slug={slug}
        />
      ) : null}
    </Stack>
  )
}
