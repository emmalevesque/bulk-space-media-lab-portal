import { BarChartIcon } from '@sanity/icons'
import { Button, Card, Container, Grid, Stack } from '@sanity/ui'
import AnimatedNumber from 'components/AnimatedNumber'
import { useFetch } from 'hooks/useFetch'
import { groq } from 'next-sanity'
import { Tool } from 'sanity'
import { IntentLink } from 'sanity/router'
import { ItemType } from 'schemas/documents/inventory/item'

// TODO: most common items checked,
// TODO: tax related stats, total checkouts, total members, total value of inventory

export default function inventoryStatsComponent(): Tool {
  return {
    name: 'inventory-stats',
    title: 'Inventory Stats',
    icon: BarChartIcon,
    component: () => {
      const totalInventoryCostQuery = groq`
      math::sum(*[_type == "item"][].replacementCost)`

      const { data: totalInventoryItemsCost, error: totalInventoryCostError } =
        useFetch(totalInventoryCostQuery) as { data: ItemType[]; error: any }

      const totalItemsQuery = groq`
      *[_type == "item"][]{
        "increment": stock,
        }`

      const { data: totalItems, error: totalItemsError } = useFetch(
        totalItemsQuery
      ) as { data: ItemType[]; error: any }

      const totalItemsCount = totalItems?.reduce((acc, curr) => {
        return acc + curr.increment
      }, 0)

      const { data: totalVariants, error: totalVariantsError } = useFetch(
        groq`*[_type == "item" && isVariant]{
          "increment": stock,
        }`
      ) as { data: ItemType[]; error: any }

      const totalVariantsCount = totalVariants?.reduce((acc, curr) => {
        return acc + curr.increment
      }, 0)

      const variantCount = totalVariantsCount || 0

      const totalCategoriesQuery = groq`
      count(*[_type == "category"])`

      const { data: totalCategories, error: totalCategoriesError } = useFetch(
        totalCategoriesQuery
      ) as { data: ItemType[]; error: any }

      const totalActiveCategoriesQuery = groq`
      *[_type == "category"][]{
        "increment": count(*[_type == "item" && references(^._id)]),
        }`

      const {
        data: totalActiveCategoriesData,
        error: totalActiveCategoriesError,
      } = useFetch(totalActiveCategoriesQuery) as {
        data: ItemType[]
        error: any
      }

      const totalActiveCategoriesCount = totalActiveCategoriesData?.reduce(
        (acc, curr) => {
          return acc + curr.increment
        },
        0
      )

      const categoriesQuery = groq`
      *[_type == "category"]{
        _id,
        name,
        "children": count(*[_type == "item" && references(^._id)])
      }| order(children desc)
      [
        0..5
      ]`

      const { data: categories, error: categoriesError } = useFetch(
        categoriesQuery
      ) as { data: ItemType[]; error: any }

      if (totalItemsError) throw new Error(totalItemsError)

      if (totalVariantsError) throw new Error(totalVariantsError)

      if (totalCategoriesError) throw new Error(totalCategoriesError)

      if (totalActiveCategoriesError)
        throw new Error(totalActiveCategoriesError)

      if (categoriesError) throw new Error(categoriesError)

      console.log({ categories })

      return (
        <Container width={[1, 2, 2]} padding={3}>
          <Stack space={3}>
            <Card tone="primary" padding={2} shadow={1} radius={3}>
              Overall Stats
            </Card>
            <Grid columns={2} gap={3}>
              <Button
                radius={3}
                padding={2}
                style={{ width: '100%', lineBreak: 'loose' }}
                mode="bleed"
              >
                <p>
                  Total <b>Inventory Value</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber
                    toValue={totalInventoryItemsCost}
                    isCurrency
                  />
                </p>
              </Button>
              <Button
                radius={3}
                padding={2}
                style={{ width: '100%', lineBreak: 'loose' }}
                mode="bleed"
              >
                <p>
                  Total <b>Inventory Items</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={totalItemsCount} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Categories</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={totalCategories} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Variants</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={variantCount} />
                </p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Non-Variants</b>
                </p>
                <p className="font-bold">
                  <AnimatedNumber toValue={totalItemsCount - variantCount} />
                </p>
              </Button>
            </Grid>
            <Card padding={2} shadow={1} radius={3} tone="caution">
              Top Categories
            </Card>
            <Grid columns={2} gap={3}>
              {Array.isArray(categories) &&
                categories?.map((category) => {
                  return (
                    <Button
                      radius={3}
                      padding={2}
                      style={{ width: '100%', lineBreak: 'loose' }}
                      mode="bleed"
                    >
                      <IntentLink
                        intent="edit"
                        params={{ id: category._id }}
                        style={{ width: '100%' }}
                      >
                        <p>
                          Total in <b>{category.name}</b>
                        </p>
                        <p className="font-bold">
                          <AnimatedNumber
                            toValue={category.children}
                            delay={2}
                          />
                        </p>
                      </IntentLink>
                    </Button>
                  )
                })}
            </Grid>
          </Stack>
        </Container>
      )
    },
  }
}
