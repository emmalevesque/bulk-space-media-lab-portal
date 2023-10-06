import { VercelRequest, VercelResponse } from '@vercel/node'
import { client } from 'lib/sanity.client'
import { sanityAlgolia } from '../_algolia'

const sanity = client

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function POST(req: VercelRequest, res: VercelResponse) {
  // Tip: Add webhook secrets to verify that the request is coming from Sanity.
  // See more at: https://www.sanity.io/docs/webhooks#bfa1758643b3
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({ message: 'Bad request' })
    return
  }

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  return sanityAlgolia
    .webhookSync(sanity, req.body)
    .then(() => res.status(200).send('ok'))
    .catch((err) => {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Something went wrong' }),
      }
    })
}
