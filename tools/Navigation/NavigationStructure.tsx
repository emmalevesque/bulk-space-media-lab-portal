import { groq } from 'next-sanity'
import { Tool, useClient } from 'sanity'
import { MenuIcon } from '@sanity/icons'
import useSWR from 'swr'
import LoadingOverlay from '@/sanity-plugin-bulk-space-portal/components/LoadingOverlay'
import { Heading, Stack } from '@sanity/ui'
import CategoryDetails from './CategoryDetails'
import { useNavigation } from './hooks/useNavigation'

export const childrenQuery = (childQuery) => groq`
      "children": 
        *[_type == "category" 
        && defined(parent) 
        && parent._ref == ^._id
      ][] 
      | order(name asc)
      {
      ...,
      ${childQuery} 
      }
`

const NavigationStructureComponent = () => {
  const client = useClient()

  const fetcher = (query) => client.fetch(query)

  const { data, isLoading, error } = useSWR(
    groq`
      *[
        _id == "settings"
      ][0]
      .categories[]->
      {
        ...,
        "_key": _id,
       ${childrenQuery(childrenQuery(''))} 
      } 
      | order(name asc)`,
    fetcher
  )

  const { activeCategory, handleCategoryClick } = useNavigation()

  if (isLoading) return <LoadingOverlay />
  if (error) throw new Error(error)

  return data ? (
    <Stack padding={4} space={4}>
      <Heading as="h2">Equipment Inventory Navigation</Heading>
      <Stack space={3}>
        {data.map((category) => (
          <CategoryDetails
            {...category}
            key={category._key}
            category={category}
            isActive={activeCategory === category.slug.current}
            onClick={handleCategoryClick}
          />
        ))}
      </Stack>
    </Stack>
  ) : (
    <LoadingOverlay />
  )
}

const NavigationStructure = (): Tool<any> => ({
  name: 'navigation-structure',
  title: 'Navigation Structure',
  icon: MenuIcon,
  component: NavigationStructureComponent,
})

export default NavigationStructure
