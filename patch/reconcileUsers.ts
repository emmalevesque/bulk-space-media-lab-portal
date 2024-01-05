// ./scripts/reconcileUsers.ts

// This script will remove the roles from all project members
// that are not in the list of "internalUsers"

import { getCliClient } from 'sanity/cli'

interface UserDetail {
  id: string
  email: string
  sanityUserId: string
  imageUrl: string
  displayName: string
  givenName: string
  familyName: string
  loginProvider: string
}

interface ProjectUser {
  projectUserId: string
  isRobot: boolean
  roles: {
    name: string
    title: string
  }[]
}

// Configure a Sanity client to make authenticated API calls
const client = getCliClient({ apiVersion: '2022-03-20' }).withConfig({
  dataset: 'demo',
})
const { projectId } = client.config()

// A list of users you want to keep
const internalUsers = [
  'emma@els.studio',
  'info@bulk-space.com',
  'emma.levesque.schaefer@gmail.com',
  'terramae@umich.edu',
].map((email) => email.toLocaleLowerCase())

async function run() {
  // 1: Perform a query for the list of Sanity project members
  const projectUsers = await client.request<ProjectUser[]>({
    url: `/projects/${projectId}/acl/`,
  })

  // 2: Filter out the robot tokens
  const humanUsers = projectUsers.filter((user) => !user.isRobot)

  // 3: Query each user's details and map them to the user ID
  const unprocessedUsers = [...humanUsers]
  const userDetails: UserDetail[] = []
  while (unprocessedUsers.length > 0) {
    const batchUsers = unprocessedUsers.splice(0, 100)
    const batchIds = batchUsers.map((user) => user.projectUserId).join(',')

    // Each member's details contain the ID and email address
    const batchUserDetails = await client.request({
      url: `/projects/${projectId}/users/${batchIds}`,
    })
    userDetails.push(...batchUserDetails)
  }

  console.log({ userDetails })

  console.log('Patching staff users...')

  const transaction = client.transaction()

  // 4: Iterate over users and create a staff document for each if the user email doesn't already exist

  userDetails.forEach((user) => {
    if (internalUsers.includes(user.email.toLocaleLowerCase())) {
      transaction.createIfNotExists({
        _id: `staff.${user.sanityUserId}`,
        _type: 'staff',
        displayName: user.displayName,
        email: user.email,
        sanityUserId: user.sanityUserId,
        givenName: user.givenName,
        familyName: user.familyName,
        imageUrl: user.imageUrl,
        loginProvider: user.loginProvider,
      })
    }
  })

  try {
    await transaction.commit()
  } catch (err) {
    console.error(err)
  }

  console.log('Complete')
}

run()
