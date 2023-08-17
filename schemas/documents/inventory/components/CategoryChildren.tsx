import { Card } from '@sanity/ui'
import CategoryInputCheckbox, {
  CategoryInputProps,
} from './CategoryInputContainer'
import { useCategoryTree } from '../hooks/useCategoryTree'
import CategoryInputContainer from './CategoryInputContainer'

type CategoryChildrenProps = {
  slug: string
  id: string
  childCategories: CategoryInputProps[]
  showChildren: boolean
}

export const CategoryChildren = (props: CategoryChildrenProps) => {
  const { slug, showChildren, childCategories } = props
  console.log({ childCategories })

  return showChildren ? (
    <Card paddingX={2}>
      {childCategories && showChildren
        ? childCategories?.map((child) => {
            return <CategoryInputContainer {...child} key={child._key} />
          })
        : null}
    </Card>
  ) : null
}
