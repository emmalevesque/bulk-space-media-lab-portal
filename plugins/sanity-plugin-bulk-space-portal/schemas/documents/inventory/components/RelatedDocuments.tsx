import { Badge, Button, Flex, Stack, Text } from '@sanity/ui'
import { groq } from 'next-sanity'
import { stripDraftNamespace } from 'plugins/sanity-plugin-bulk-space-portal/productionUrl/utils'
import { IntentLink } from 'sanity/router'
import { useFetch } from '@/sanity-plugin-bulk-space-portal/hooks/useFetch'
import { camelCaseToTitleCase } from 'lib/helper/camelCaseToTitleCase'
import LoadingOverlay from '@/sanity-plugin-bulk-space-portal/components/global/LoadingOverlay'

export default function ReferencesComponent(props) {
  const { documentId } = props ?? {}

  const titleFragment = groq`"title": coalesce(title, name, user->.name, 'Checkout')`

  const query = groq`*[
    // if it references this id (items in this category)
    references($id)
    // or if it is this id
    || _id == $id
  ]{
    ..., 
    ${titleFragment},
    "categories": categories[]->{
      ...,
      ${titleFragment}
    }
  } | order(_updatedAt desc)[]`

  const params = {
    id: documentId,
  }

  // const documentStore = useDocumentStore()

  // const referencedDocuments = useMemoObservable(() => documentStore.listenQuery(query, params, {}), [documentStore, query, params])

  // console.log({ referencedDocuments});

  let { data: referencedDocuments, error } = useFetch(query, params)

  if (error) throw new Error(error.message)

  if (!referencedDocuments || !Array.isArray(referencedDocuments))
    return <LoadingOverlay />

  referencedDocuments = referencedDocuments
    // concatenate the main list with the referenced documents
    .concat(
      [...referencedDocuments?.map((doc) => doc.categories).flat()]
        // don't include any empty values
        .filter(Boolean)
    )
    // concatenate the list with the category items
    // sort by type
    .sort((a, b) => {
      if (a._type < b._type) return -1
      if (a._type > b._type) return 1
      return 0
    })
    // finally filter out the current document
    .filter(({ _id }) => _id !== documentId)

  return (
    <>
      {Array.isArray(referencedDocuments) && referencedDocuments.length > 0 ? (
        <Stack space={2} padding={3}>
          {referencedDocuments?.map((document) => (
            <Button padding={3} mode="bleed" key={document?._id}>
              <IntentLink
                intent="edit"
                params={{ id: stripDraftNamespace(document?._id) }}
                style={{ width: '100%' }}
              >
                <Flex align="center" justify="space-between">
                  <Stack space={2}>
                    <Text weight="semibold" size={1}>
                      {document?.title}
                    </Text>
                    {document?.checkoutItems &&
                      Array.isArray(document?.checkoutItems) && (
                        <Text size={1} muted>
                          {document.checkoutItems.length === 1
                            ? '1 item'
                            : `${document?.checkoutItems.length} items`}

                          {document?.checkoutDate &&
                            ` • ${new Date(
                              document?.checkoutDate
                            ).toLocaleDateString()}`}
                        </Text>
                      )}
                  </Stack>
                  <Badge tone="caution" paddingX={2}>
                    {camelCaseToTitleCase(document?._type)}
                  </Badge>
                </Flex>
              </IntentLink>
            </Button>
          ))}
        </Stack>
      ) : (
        <LoadingOverlay />
      )}
    </>
  )
}
