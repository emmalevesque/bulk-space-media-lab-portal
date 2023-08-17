import { Checkbox, Inline, Stack, Text } from '@sanity/ui'
import { useCategoryTree } from '../hooks/useCategoryTree'
import { CategoryChildren } from './CategoryChildren'
import { CategoryInputProps } from './CategoryInputContainer'

type CategoryInputCheckboxProps = Partial<HTMLInputElement> & {
  id: string
  slug: string
  label: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  childCategories?: CategoryInputProps[] | undefined
}

export const CategoryInputCheckbox = ({
  id,
  slug,
  label,
  childCategories,
  onClick,
  checked,
}: CategoryInputCheckboxProps) => {
  return (
    <Stack>
      <Inline space={2} paddingY={2}>
        <Checkbox id={id} checked={checked} onClick={onClick} />
        <label htmlFor={id}>{label}</label>
      </Inline>
      {Array.isArray(childCategories) ? (
        <CategoryChildren
          id={id}
          showChildren={checked || false}
          childCategories={childCategories}
          slug={slug}
        />
      ) : null}
    </Stack>
  )
}
