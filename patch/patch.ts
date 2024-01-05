import { createClient } from '@sanity/client'
import { dataset, projectId } from 'lib/sanity.api'
import { groq } from 'next-sanity'

const client = createClient({
  projectId,
  dataset,
  token: process.env.NEXT_PUBLIC_SANITY_PATCH_TOKEN,
})

// Function to query and patch documents
const queryAndPatchDocuments = async () => {
  // Query for a set of documents; replace the query as needed
  const documents = await client.fetch(groq`
    *[
      _type == "item" 
     ] | order(_createdAt desc)
     []{
      _id,
      description
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
        useShortName: false,
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
