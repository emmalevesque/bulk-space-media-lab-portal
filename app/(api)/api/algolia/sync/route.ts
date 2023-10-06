import { client } from 'lib/sanity.client'
import { sanityAlgolia } from '../_algolia'
import { NextRequest, NextResponse } from 'next/server'

const sanity = client

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function POST(req: NextRequest, res: NextResponse) {
  const requestHeaders = new Headers(req.headers)
  if (requestHeaders.get('content-type') !== 'application/json') {
    return Response.json({
      status: 400,
      message: 'Bad request',
    })
  }

  const body = req.json()

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  return sanityAlgolia
    .webhookSync(sanity, await body)
    .then(() => Response.json({ status: 200, message: 'OK' }))
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong' }),
      }
    })
}
