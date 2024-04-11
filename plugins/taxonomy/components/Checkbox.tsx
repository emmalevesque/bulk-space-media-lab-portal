import { Checkbox, Inline, Stack } from '@sanity/ui'
import { CategoryChildren } from './Children'
import { ContainerProps } from './Container'
import { useTaxonomy } from '../hooks/useTaxonomy'

type CheckboxProps = Partial<HTMLInputElement> & {
  id: string
  slug: string
  label: string
  onClick?: any
  childCategories?: ContainerProps[] | undefined
}

export const CheckboxComponent = ({
  id,
  slug,
  label,
  childCategories,
  onClick,
}: CheckboxProps) => {
  const { value = [] } = useTaxonomy()

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
