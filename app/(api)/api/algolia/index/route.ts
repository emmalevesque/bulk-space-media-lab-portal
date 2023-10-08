import { client } from 'lib/sanity.client'
import { NextResponse } from 'next/server'

import { sanityAlgolia } from '../_algolia'
import { groq } from 'next-sanity'

export async function GET(req, res) {
  const sanity = client // configured Sanity client

  // Fetch the _id of all the documents we want to index
  const types = ['item', 'checkout', 'user', 'category']
  const query = groq`*[_type in $types && !(_id in path("drafts.**"))][]._id`

  try {
    sanity.fetch(query, { types }).then((ids) =>
      sanityAlgolia.webhookSync(sanity, {
        ids: { created: ids, updated: [], deleted: [] },
      })
    )
    return NextResponse.json({
      status: 200,
      message: 'Hello, World!',
    })
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: err,
    })
  }
}
