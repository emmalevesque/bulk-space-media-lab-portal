import { DashboardWidget, DashboardWidgetContainer } from '@sanity/dashboard'
import { Button, Card, Grid, Stack } from '@sanity/ui'
import { groq } from 'next-sanity'
import { useEffect, useState } from 'react'
import { IntentButton, useClient } from 'sanity'

const Footer = () => {
  return (
    <Button
      text="View Inventory"
      mode="ghost"
      tone="primary"
      padding={3}
      fontSize={1}
      style={{ marginTop: '1rem' }}
    />
  )
}

export default function inventoryStatsWidget(config): DashboardWidget {
  return {
    name: 'inventory-stats-widget',
    component: () => {
      const client = useClient()

      const [count, set] = useState<number>(0)

      // count all items
      useEffect(() => {
        if (!client) return

        const documentCount = client
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

        const documentCount = client
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

        const documentCount = client
          .fetch(
            groq`count(*[_type == "category"])
            `
          )
          .then(setTotalCategories)
      }, [client])

      const [categories, setCategories] = useState<any[]>([])

      // get the categories
      useEffect(() => {
        if (!client) return

        client
          .fetch(
            groq`*[_type == "category"][]{
              _id,
              name,
              "children": count(*[_type == "item" && references(^._id)])
            }| order(children desc)`
          )
          .then(setCategories)
      }, [client])

      return (
        <DashboardWidgetContainer
          header={`Inventory Stats`}
          footer={
            <IntentButton
              mode="bleed"
              style={{ width: '100%' }}
              paddingX={2}
              paddingY={4}
              tone="primary"
              type="button"
              intent="browse"
              text="View Inventory"
              id="inventory-stats-widget-view-inventory"
              params={{ type: 'item' }}
            />
          }
        >
          <Card padding={3}>
            <Stack space={3}>
              <Card tone="primary" padding={2} shadow={1} radius={3}>
                Overall Stats
              </Card>
              <Grid columns={2} gap={3}>
                <Card padding={2} shadow={1} radius={3}>
                  <p>Total Items in Inventory</p>
                  <p className="font-bold">{count}</p>
                </Card>
                <Card padding={2} shadow={1} radius={3}>
                  <p>Total Variants</p>
                  <p className="font-bold">{variantCount}</p>
                </Card>
                <Card padding={2} shadow={1} radius={3}>
                  <p>Total Non-Variants</p>
                  <p className="font-bold">{count - variantCount}</p>
                </Card>
                <Card padding={2} shadow={1} radius={3}>
                  <p>Total Categories</p>
                  <p className="font-bold">{totalCategories}</p>
                </Card>
              </Grid>
              <Card padding={0} shadow={1} tone="default" radius={3} />
              <Card padding={2} shadow={1} radius={3} tone="caution">
                Categories
              </Card>
              <Grid columns={2} gap={3}>
                {categories?.map((category) => {
                  return (
                    <Card padding={2} shadow={1} radius={3}>
                      <p>Total in {category.name}</p>
                      <p className="font-bold">{category.children}</p>
                    </Card>
                  )
                })}
              </Grid>
            </Stack>
          </Card>
        </DashboardWidgetContainer>
      )
    },
    layout: {
      width: 'auto',
      height: 'auto',
    },
  }
}
