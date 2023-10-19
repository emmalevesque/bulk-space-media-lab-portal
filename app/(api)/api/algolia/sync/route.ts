// @ts-ignore
import { client } from 'lib/sanity.client'
import { algoliaIndex } from '../_algolia'
import { NextRequest, NextResponse } from 'next/server'
import indexer from 'sanity-algolia'
import { ALL_DOCUMENTS } from '../index/route'

const sanityClient = client

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function POST(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const secret = requestHeaders.get('secret')

  if (requestHeaders.get('content-type') !== 'application/json') {
    return NextResponse.json(
      {
        status: 400,
        message: 'Bad request',
      },
      {
        status: 400,
        statusText: 'Bad request',
      }
    )
  } else if (secret !== process.env.NEXT_PUBLIC_ALGOLIA_SECRET) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
        statusText: 'Unauthorized',
      }
    )
  }

  const body = await request.json()

  const index = algoliaIndex
  const sanityAglolia = indexer(
    {
      item: {
        index,
        projection: ALL_DOCUMENTS,
      },
      user: {
        index,
        projection: ALL_DOCUMENTS,
      },
      category: {
        index,
        projection: ALL_DOCUMENTS,
      },
      checkout: {
        index,
        projection: ALL_DOCUMENTS,
      },
    },
    (document) => document,
    (document) => !['draft'].includes(document._id.split('.')[1])
  )

  return sanityAglolia
    .webhookSync(sanityClient, body)
    .then((result) => {
      return NextResponse.json(
        {
          message: 'Webhook received',
          result,
        },
        {
          status: 200,
          statusText: 'OK',
        }
      )
    })
    .catch((err) => {
      return NextResponse.json(
        { error: err },
        {
          status: err.status,
          statusText: err.message,
        }
      )
    })
}
