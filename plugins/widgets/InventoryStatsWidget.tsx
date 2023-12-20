import { DashboardWidget, DashboardWidgetContainer } from '@sanity/dashboard'
import {
  Button,
  Card,
  Grid,
  Stack,
  ThemeProvider,
  studioTheme,
} from '@sanity/ui'
import { groq } from 'next-sanity'
import { useEffect, useState } from 'react'
import { IntentButton, useClient } from 'sanity'

const Footer = () => {
  return (
    <Button
      text="View Inventory"
      mode="bleed"
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
        <ThemeProvider theme={studioTheme}>
          <DashboardWidgetContainer
            header={`Inventory Stats`}
            footer={
              <IntentButton
                mode="bleed"
                style={{ width: '100%' }}
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
                    <p>Total Inventory Items</p>
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
                  Top Categories
                </Card>
                <Grid columns={2} gap={3}>
                  {categories?.map((category) => {
                    return (
                      <Card shadow={1} radius={3}>
                        <Button
                          padding={2}
                          style={{ width: '100%', lineBreak: 'loose' }}
                          mode="bleed"
                        >
                          <p>Total in {category.name}</p>
                          <p className="font-bold">{category.children}</p>
                        </Button>
                      </Card>
                    )
                  })}
                </Grid>
              </Stack>
            </Card>
          </DashboardWidgetContainer>
        </ThemeProvider>
      )
    },
    layout: {
      width: 'auto',
      height: 'auto',
    },
  }
}
