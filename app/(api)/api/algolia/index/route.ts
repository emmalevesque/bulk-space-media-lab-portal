import { client } from 'lib/sanity.client'
import { SanityDocumentStub } from 'next-sanity'

import algoliasearch from 'algoliasearch'
import { sanityAlgolia } from '../_algolia'

export async function GET() {
  const sanity = client // configured Sanity client

  // Fetch the _id of all the documents we want to index
  const types = ['item', 'checkout', 'user', 'category']
  const query = `* [_type in $types && !(_id in path("drafts.**"))][]._id`

  sanity.fetch(query, { types }).then((ids) =>
    sanityAlgolia.webhookSync(sanity, {
      ids: { created: ids, updated: [], deleted: [] },
    })
  )
  return Response.json({
    status: 200,
    message: 'Hello, World!',
  })
}
