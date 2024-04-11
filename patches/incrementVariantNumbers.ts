// ./scripts/reconcileUsers.ts

// This script will remove the roles from all project members
// that are not in the list of "internalUsers"

import { groq } from 'next-sanity'
import { getCliClient } from 'sanity/cli'

// Configure a Sanity client to make authenticated API calls
const client = getCliClient({ apiVersion: '2022-03-20' }).withConfig({
  dataset: 'production',
})

// A list of users you want to keep
// const internalUsers = [
//   'emma@els.studio',
//   'info@bulk-space.com',
//   'emma.levesque.schaefer@gmail.com',
//   'terramae@umich.edu',
// ].map((email) => email.toLocaleLowerCase())

async function run() {
  const transaction = client.transaction()

  const items = await client.fetch(
    groq`
  *[_type == 'item' && defined(variantNumber) && variantNumber == 0][]{
    _id,
    variantNumber
  }`,
    {},
    { perspective: 'previewDrafts' }
  )

  items
    .filter(
      ({ _id }) => !['fdbfa549-3b07-4817-b7ed-16f0f8e2a61d'].includes(_id)
    )
    .forEach((item) => {
      if (item.variantNumber === 0) {
      }
      console.log('update item', item._id, 'variantNumber', 1)
      transaction.patch(item._id, { set: { variantNumber: 1 } })
    })

  try {
    await transaction.commit()
    // console.log({ transaction })
  } catch (err) {
    console.error(err)
  }

  console.log('Complete')
}

run()
