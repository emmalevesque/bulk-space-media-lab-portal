import { Box, Card, Flex, Grid, Heading, Text } from '@sanity/ui'
import { useInventory } from '../../hooks/hooks/useInventory'
import { useMemo } from 'react'

import { IntentLink } from 'sanity/router'
import LoadingOverlay from 'components/global/LoadingOverlay'
import moment from 'moment'

import Loading from 'components/global/Loading'

export default (props) => {
  if (!props?.document?.displayed?._id) return <Loading />

  const { relatedCheckouts } = useInventory(props?.document?.displayed)

  return useMemo(
    () =>
      relatedCheckouts ? (
        <Box padding={4}>
          <Flex direction={`column`} gap={5}>
            <Heading size={2}>Related Checkouts</Heading>
            <Grid columns={1} gap={2}>
              {relatedCheckouts && Array.isArray(relatedCheckouts)
                ? relatedCheckouts?.map((checkout) => {
                    return (
                      <IntentLink
                        key={checkout?._id}
                        intent="edit"
                        params={{ id: checkout._id, type: checkout._type }}
                      >
                        <Card key={checkout._id}>
                          <Flex className="group" direction={`column`} gap={3}>
                            <Heading className="group-hover:underline" size={3}>
                              {checkout.user}
                            </Heading>
                            <Text className="group-hover:underline">{`Checked out ${moment(
                              checkout?.checkoutDate
                            ).format('MM/DD/YY')}`}</Text>
                          </Flex>
                        </Card>
                      </IntentLink>
                    )
                  })
                : null}
            </Grid>
          </Flex>
        </Box>
      ) : (
        <LoadingOverlay />
      ),
    [relatedCheckouts]
  )
}
