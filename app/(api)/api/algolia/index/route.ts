import { client } from 'lib/sanity.client'

import { algoliaIndex } from '../_algolia'
import { groq } from 'next-sanity'
import { NextResponse } from 'next/server'

/***
 * Shouts to @hdoro for this one:
 * https://hdoro.dev/integrating-sanity-io-algolia
 * extremely patient and helpful tutorial
 */

export const ALL_DOCUMENTS = groq`
    // Bureaucracies - shared across all
    _type,
    _rev,
    "objectID": _id,
    _createdAt,
  
    // Item
    _type == 'item' => {
      "title": name,
      "path": slug.current,
      "make": manufacturerDetails.make,
      "model": manufacturerDetails.model,
      "description": description,
      "categories": categories[]->.name
    },

    _type == 'user' => {
      "title": name,
      "path": slug.current,
      "email": contact.email,
      "phone": contact.phone
    },

    _type == 'category' => {
      "title": name,
      "path": slug.current,
      "parent": parent->.name
    },

    _type == 'checkout' => {
      "title": name,
      "path": slug.current,
      "parent": parent->.name
    }
  `

export async function GET(req, res) {
  const documentTypes = ['item', 'user', 'category', 'checkout']
  const documentsQuery = groq`
      *[
      _type in $documentTypes
      && !(_id in path("drafts.**"))
      ]{
        ${ALL_DOCUMENTS} 
      }
      `

  const documents = await client.fetch(documentsQuery, {
    documentTypes,
  })

  try {
    console.time(`Saving ${documents.length} documents to index:`)
    await algoliaIndex.saveObjects(documents)
    console.timeEnd(`Saving ${documents.length} documents to index:`)
    return NextResponse.json({
      status: 200,
      body: 'Success!',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 500,
      body: error,
    })
  }
}
