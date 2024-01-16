import { createClient } from '@sanity/client'
import { projectId } from 'lib/sanity.api'
import { groq } from 'next-sanity'

const client = createClient({
  projectId,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.NEXT_PUBLIC_SANITY_PATCH_TOKEN,
})

// Function to query and patch documents
const queryAndPatchDocuments = async () => {
  // Query for a set of documents; replace the query as needed
  const documents = await client.fetch(groq`
    *[
      _type == "item" &&
      !isVariant && 
      variantNumber == 1
     ] | order(_createdAt desc)
     []{
      _id,
     }
   `)

  const transaction = client.transaction()

  // Loop through each document and apply patches
  documents.forEach(async (doc) => {
    // const make = doc?.name?.split(' ').slice(0, 1).join(' ')
    // const model = doc?.name?.split(' ').slice(1).join(' ')

    // Example: Update the `name` field of each document
    transaction.patch(doc._id, {
      set: {
        variantNumber: 0,
      },
    })
  })

  try {
    await transaction.commit()
  } catch (err) {
    console.error(err)
  }
}
queryAndPatchDocuments()
