import { client } from 'lib/sanity.client'
import { sanityAlgolia } from '../_algolia'
import { NextResponse } from 'next/server'

const sanity = client

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function POST(req: Request, res) {
  const requestHeaders = new Headers(req.headers)
  if (requestHeaders.get('content-type') !== 'application/json') {
    return NextResponse.json({
      status: 400,
      message: 'Bad request',
    })
  }

  const body = await req.json()

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  return sanityAlgolia
    .webhookSync(sanity, body)
    .then(() => NextResponse.json({ status: 200, message: 'OK' }))
    .catch((err) => {
      return res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: err,
      })
    })
}
