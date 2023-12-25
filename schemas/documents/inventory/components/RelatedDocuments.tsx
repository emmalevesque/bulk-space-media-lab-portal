import { Badge, Card, Flex, Stack, Text } from '@sanity/ui'
import { useFetch } from 'hooks/useFetch'
import { groq } from 'next-sanity'
import { IntentLink } from 'sanity/router'

export default function ReferencesComponent(props) {
  const query = groq`*[
        (
          _id in checkoutItems[]._ref
       )
      ][]{ _id, title, name, _type}`
  const params = {
    id: props.documentId,
  }

  const { data: referencedDocuments, error } = useFetch(query, params)

  if (error) throw new Error(error.message)

  if (!referencedDocuments || !Array.isArray(referencedDocuments))
    return <p>Loading...</p>

  return (
    <>
      {Array.isArray(referencedDocuments) && referencedDocuments.length > 0 ? (
        <Stack space={3} padding={3}>
          {referencedDocuments.map((document) => (
            <IntentLink params={{ id: document._id }} intent="edit">
              <Card shadow={1} padding={4} radius={2} key={document._id}>
                <Flex align="center" justify="space-between">
                  <Text>{document.title || document.name}</Text>
                  <Badge tone="caution" mode="outline">
                    {document._type}
                  </Badge>
                </Flex>
              </Card>
            </IntentLink>
          ))}
        </Stack>
      ) : (
        <Card padding={3} radius={2} tone="critical"></Card>
      )}
    </>
  )
}
