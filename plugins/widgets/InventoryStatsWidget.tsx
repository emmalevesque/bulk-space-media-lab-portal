import { BarChartIcon } from '@sanity/icons'
import { Button, Card, Container, Grid, Stack } from '@sanity/ui'
import { groq } from 'next-sanity'
import { useEffect, useState } from 'react'
import { Tool, useClient } from 'sanity'
import { IntentLink } from 'sanity/router'

export default function inventoryStatsComponent(): Tool {
  return {
    name: 'inventory-stats',
    title: 'Inventory Stats',
    icon: BarChartIcon,
    component: () => {
      const client = useClient()

      const [count, set] = useState<number>(0)

      // count all items
      useEffect(() => {
        if (!client) return

        client
          .fetch(
            groq`
          *[_type == "item"][]{
            "increment": stock,
          }`
          )
          .then((res) => {
            return res.reduce((acc, curr) => {
              return acc + curr.increment
            }, 0)
          })
          .then(set)
      }, [client])

      const [variantCount, setVariantCount] = useState<number>(0)

      // count the variants
      useEffect(() => {
        if (!client) return

        client
          .fetch(
            groq`*[_type == "item" && isVariant]{
                  "increment": stock,
                }`
          )
          .then((res) => {
            return res.reduce((acc, curr) => {
              return acc + curr.increment
            }, 0)
          })
          .then(setVariantCount)
      }, [client])

      const [totalCategories, setTotalCategories] = useState<number>(0)

      // count the total categories
      useEffect(() => {
        if (!client) return

        client
          .fetch(
            groq`count(*[_type == "category"])
                `
          )
          .then(setTotalCategories)
      }, [client])

      const [categories, setCategories] = useState<
        {
          _id: string
          name: string
          children: number
        }[]
      >([])

      // get the categories
      useEffect(() => {
        if (!client) return

        client
          .fetch(
            groq`*[_type == "category"]{
                  _id,
                  name,
                  "children": count(*[_type == "item" && references(^._id)])
                }| order(children desc)
                [
                  0..5
                ]`
          )
          .then(setCategories)
      }, [client])
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
                  Total <b>Inventory Items</b>
                </p>
                <p className="font-bold">{count}</p>
              </Button>

              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Variants</b>
                </p>
                <p className="font-bold">{variantCount}</p>
              </Button>

              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Variants</b>
                </p>
                <p className="font-bold">{variantCount}</p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Non-Variants</b>
                </p>
                <p className="font-bold">{count - variantCount}</p>
              </Button>
              <Button padding={2} mode="bleed" radius={3}>
                <p>
                  Total <b>Categories</b>
                </p>
                <p className="font-bold">{totalCategories}</p>
              </Button>
            </Grid>
            <Card padding={2} shadow={1} radius={3} tone="caution">
              Top Categories
            </Card>
            <Grid columns={2} gap={3}>
              {categories?.map((category) => {
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
                      <p className="font-bold">{category.children}</p>
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
