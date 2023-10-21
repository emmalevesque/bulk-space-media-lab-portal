import { Text, Card } from '@sanity/ui'
import { SanityDocument } from 'next-sanity'
import { Slug } from 'sanity'

type CategoryProps = SanityDocument & {
  slug: Slug
  name: string
  children?: CategoryProps[]
  _key?: string
  isActive?: boolean
  onClick?: () => void
}

export default function CategoryDetails({ name, children }: CategoryProps) {
  return Array.isArray(children) ? (
    <Card paddingX={4}>
      {Array.isArray(children) ? (
        <details>
          <summary>{name}</summary>
          <>
            {children.map((child) => (
              <CategoryDetails key={child._id} {...child} />
            ))}
          </>
        </details>
      ) : (
        <Card paddingY={2} paddingX={4} tone="default">
          <Text>{name}</Text>
        </Card>
      )}
    </Card>
  ) : (
    <Card paddingY={2} paddingX={4} tone="default">
      <Text>{name}</Text>
    </Card>
  )
}
