import { client } from 'lib/sanity.client'
import { NextResponse } from 'next/server'

import { sanityAlgolia } from '../_algolia'

export async function GET(req, res) {
  const sanity = client // configured Sanity client

  // Fetch the _id of all the documents we want to index
  const types = ['item', 'checkout', 'user', 'category']
  const query = `* [_type in $types && !(_id in path("drafts.**"))][]._id`

  sanity.fetch(query, { types }).then((ids) =>
    sanityAlgolia.webhookSync(sanity, {
      ids: { created: ids, updated: [], deleted: [] },
    })
  )
  return NextResponse.json({
    status: 200,
    message: 'Hello, World!',
  })
}
