import { createClient } from '@sanity/client'
import { projectId } from 'lib/sanity.api'

import { faker } from '@faker-js/faker'
import { uuid } from '@sanity/uuid'
import slugify from 'slugify'

const client = createClient({
  projectId,
  dataset: 'preview',
  useCdn: false,
  apiVersion: '2021-03-25',
  token: process.env.NEXT_PUBLIC_SANITY_PATCH_TOKEN,
})

// Function to query and patch documents
const queryAndPatchDocuments = async () => {
  // Query for a set of documents; replace the query as needed

  const staffMembers = await client.fetch(`*[_type == "staff"][]{_id}`)

  const items = await client.fetch(`*[_type == "item"][]{
    _id
  }`)

  const members = new Array(40).fill(0).map(() => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
      _id: `user-${slugify(firstName + lastName, {
        strict: true,
        lower: true,
      })}`,
      _type: 'user',
      slug: {
        _type: 'slug',
        current: slugify(firstName + lastName, { strict: true, lower: true }),
      },
      name: `${firstName} ${lastName}`,
      contact: {
        email: faker.internet.email({
          firstName: firstName,
          lastName: lastName,
          provider: 'gmail',
        }),
        phone: faker.phone.number(),
      },
    }
  })

  const checkouts = new Array(50).fill(0).map(() => {
    const getRandomMember = () => {
      const randomIndex = Math.floor(Math.random() * members.length)
      return members[randomIndex]
    }

    const getRandomItem = () => {
      const randomIndex = Math.floor(Math.random() * items.length)
      return items[randomIndex]
    }

    const getRandomStaffMember = () => {
      const randomIndex = Math.floor(Math.random() * staffMembers.length)
      return staffMembers[randomIndex]
    }

    const member = getRandomMember()
    const item = getRandomItem()
    const staffMember = getRandomStaffMember()

    const isCheckedOut = faker.datatype.boolean()

    const isReturned = isCheckedOut ? faker.datatype.boolean() : false

    return {
      _id: `checkout-${uuid()}`,
      _type: 'checkout',
      staffMember: {
        _weak: true,
        _type: 'reference',
        _ref: staffMember._id,
      },
      user: {
        _weak: true,
        _type: 'reference',
        _ref: member._id,
      },
      checkoutItems: [
        {
          _key: uuid(),
          _weak: true,
          _type: 'reference',
          _ref: item._id,
        },
      ],
      isCheckedOut,
      isReturned,
      checkoutDate: isReturned ? faker.date.past() : faker.date.recent(),
      returnDate: isReturned ? faker.date.recent() : null,
    }
  })

  console.log({ checkouts })

  const transaction = client.transaction()

  members.forEach(async (doc) => {
    transaction.createOrReplace(doc)
  })

  checkouts.forEach(async (doc) => {
    transaction.createOrReplace(doc)
  })

  try {
    await transaction.commit().then((res) => console.log({ res }))
    // console.log({ transaction })
  } catch (err) {
    console.error(err)
  }
}
queryAndPatchDocuments()
