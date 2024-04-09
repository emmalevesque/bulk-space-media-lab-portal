import { Card } from '@sanity/ui'
import { CategoryInputContainerProps } from './CategoryInputContainer'
import CategoryInputContainer from './CategoryInputContainer'

type CategoryChildrenProps = {
  slug: string
  id: string
  childCategories: CategoryInputContainerProps[]
  showChildren: boolean
}

export const CategoryChildren = (props: CategoryChildrenProps) => {
  const { showChildren, childCategories } = props

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
