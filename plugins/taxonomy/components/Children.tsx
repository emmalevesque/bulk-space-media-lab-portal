import { Card } from '@sanity/ui'
import { ContainerProps } from './Container'
import Container from './Container'

type ChildrenProps = {
  slug: string
  id: string
  childCategories: ContainerProps[]
  showChildren: boolean
}

export const CategoryChildren = (props: ChildrenProps) => {
  const { showChildren, childCategories } = props

  return showChildren ? (
    <Card paddingX={2}>
      {childCategories && showChildren
        ? childCategories?.map((child) => {
            return <Container {...child} key={child._key} />
          })
        : null}
    </Card>
  ) : null
}
