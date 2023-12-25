import { Badge, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { useFetch } from 'hooks/useFetch'
import { groq } from 'next-sanity'
import { stripDraftNamespace } from 'plugins/productionUrl/utils'
import { IntentLink } from 'sanity/router'

export default function ReferencesComponent(props) {
  const query = groq`*[
    // simple reference
    references($id) ||
    // 
    *[_type == 'checkout' && _id == $id].checkoutItems[]._ref
  ]{
    ..., 
    "title": coalesce(title, name, user->.name, 'Checkout'),
    } | order(_updatedAt desc)[]`

  const params = {
    id: props.documentId,
  }

  const { data: referencedDocuments, error } = useFetch(query, params)

  if (error) throw new Error(error.message)

  if (!referencedDocuments || !Array.isArray(referencedDocuments))
    return (
      <Card padding={4}>
        <Flex style={{ width: '100%' }}>
          <Card
            padding={3}
            radius={2}
            className="animate-pulse"
            style={{ background: 'white', opacity: 0.4, width: '100%' }}
          ></Card>
        </Flex>
      </Card>
    )

  return (
    <>
      {Array.isArray(referencedDocuments) && referencedDocuments.length > 0 ? (
        <Stack space={3} padding={3}>
          {referencedDocuments?.map((document) => (
            <Button padding={3} mode="bleed" key={document?._id}>
              <IntentLink
                intent="edit"
                params={{ id: stripDraftNamespace(document._id) }}
                style={{ width: '100%' }}
              >
                <Flex align="center" justify="space-between">
                  <Flex gap={3} align="center" justify="flex-start">
                    <Text>{document.title}</Text>
                    <Text>
                      {document.checkoutItems.length === 1
                        ? '1 item'
                        : `${document?.checkoutItems.length} items`}
                    </Text>
                  </Flex>
                  <Badge tone="caution" mode="outline">
                    {document._type}
                  </Badge>
                </Flex>
              </IntentLink>
            </Button>
          ))}
        </Stack>
      ) : (
        <Card padding={4}>
          <Button
            padding={3}
            radius={3}
            style={{ background: 'white', opacity: 0.4 }}
          ></Button>{' '}
        </Card>
      )}
    </>
  )
}
