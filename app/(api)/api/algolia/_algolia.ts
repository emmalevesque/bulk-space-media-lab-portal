import algoliasearch from 'algoliasearch'

export const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY || ''
)
export const algoliaIndex = algolia.initIndex('bulk-space-media-lab')
