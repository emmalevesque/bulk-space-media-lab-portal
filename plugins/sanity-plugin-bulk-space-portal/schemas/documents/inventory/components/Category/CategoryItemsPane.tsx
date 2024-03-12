import { Box, Card, Grid, Heading, Inline, Stack, Text } from '@sanity/ui'
import LoadingOverlay from '@/sanity-plugin-bulk-space-portal/components/global/LoadingOverlay'
import { groq } from 'next-sanity'
import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { ItemType } from '../../item'
import { IntentLink } from 'sanity/router'

export default function CategoryProductsPane(props) {
  const client = useClient().withConfig({ apiVersion: '2021-06-07' })

  const [items, setItems] = useState([])

  useEffect(() => {
    client
      .fetch(
        groq`*[_type == "item" && $id in categories[]._ref]{
          ...,
        }`,
        { id: props?.document?.displayed?._id.replace('drafts.', '') }
      )
      .then((data) => {
        setItems(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.document?.displayed?._id])

  useEffect(() => {
    console.log({ items })
  }, [items])

  return items ? (
    <Box padding={5}>
      <Stack space={5}>
        <Text weight="regular">
          <Inline space={1}>
            Inventory in <strong>{props?.document?.displayed?.name}</strong>
          </Inline>
        </Text>

        <Stack space={2}>
          <Grid columns={3} gap={3}>
            {items?.map((item: ItemType) => (
              <IntentLink
                key={item._id}
                intent="edit"
                params={{ id: item._id }}
              >
                <Card key={item._id} padding={3} radius={2} shadow={1}>
                  <Stack padding={3} space={4}>
                    <Heading as="h3" size={1}>
                      <Text weight="bold">
                        {`
                      ${item.manufacturerDetails.make}
                      ${item.manufacturerDetails.model}
                      ${item.name}
                      `}
                      </Text>
                    </Heading>
                    <Text>{item.description}</Text>
                  </Stack>
                </Card>
              </IntentLink>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <LoadingOverlay />
  )
}
