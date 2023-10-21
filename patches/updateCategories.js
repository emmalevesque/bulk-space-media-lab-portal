import { createClient } from '@sanity/client'

// This file is the first of potentially many future "patch" scripts.
// If/when more patch scripts are created, this one should be generalized
// and its code should be reused.
// To run it, you must first fill in the values of the following variables
// and then run `sanity exec patches/enableWaitlist.js --with-user-token`
const projectId = 'bmqmwexi'
const apiVersion = '2021-03-25'
const dataset = 'production'
const token =
  'skg280DY6n7oLgMyaBBPuF9AvZLYqCLipnj6nUKLzHlQYFfzz9xxBDiZ6cPU3cQhRMlNG4HcIviGAA9LayXJk5cuXw5JJw9E2W0ye5Zy0hMDIRLZKLkvd01v9S8ab0qvdndQWkHr5veXEYxqtMr1bXtPeH38pSLJS5Naqh6EDba8OW5KPGmC'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

const fetchDocuments = () =>
  client.fetch(`*[_type == "category" && _createdAt > "2023-08-09T00:00:00" && !(_id in path("drafts.**"))][] 
  | order(_createdAt asc){
    _id,
  _createdAt,  
  title,
    slug,
    "parent": *[references(^._id)][0]{
      "parent": *[references(^._id)][0]{
        "_type": "reference",
        "_ref": _id
      },
      "_type": "reference",
      "_ref": _id
    },
  }`)

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: { parent: doc.parent },
      // this will cause the transaction to fail if the documents has been
      // modified since it was fetched.
      ifRevisionID: doc._rev,
    },
  }))

const createTransaction = (patches) =>
  patches.reduce(
    (tx, patch) => tx.patch(patch.id, patch.patch),
    client.transaction()
  )

const commitTransaction = (tx) => tx.commit()

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  const patches = buildPatches(documents)
  if (patches.length === 0) {
    return null
  }
  console.log(
    `Migrating batch of ${patches.length} documents:\n %s`,
    patches
      .map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`)
      .join('\n')
  )
  const transaction = createTransaction(patches)
  await commitTransaction(transaction)
  return migrateNextBatch()
}

migrateNextBatch().catch((err) => {
  console.error(err)
  process.exit(1)
})
