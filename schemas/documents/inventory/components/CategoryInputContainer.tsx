import { Card, Box } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'
import { Slug } from 'sanity'
import { useCategoryTree } from '../hooks/useCategoryTree'
import { CategoryInputCheckbox } from './CategoryInputCheckbox'
import { CategoryChildren } from './CategoryChildren'

export type CategoryInputProps = SanityDocument & {
  slug: Slug
  title: string
  children?: CategoryInputProps[]
  _key?: string
  isActive?: boolean
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function CategoryInputContainer({
  _id,
  title,
  slug,
  children,
}: CategoryInputProps) {
  // create state for this parent category
  const { showChildren, toggleShowChildren } = useCategoryTree()
  return (
    <Box>
      {/* Parent Categories */}
      {Array.isArray(children) ? (
        <CategoryInputCheckbox
          id={_id}
          label={`${title} (${children.length})`}
          slug={slug.current}
          childCategories={children}
          onClick={toggleShowChildren}
          checked={showChildren}
        />
      ) : (
        <Card tone="default">
          <CategoryInputCheckbox id={_id} label={title} slug={slug.current} />
        </Card>
      )}
    </Box>
  )
}
