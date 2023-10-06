import indexer from 'sanity-algolia'
import algoliasearch from 'algoliasearch'
import { SanityDocumentStub } from 'next-sanity'

export const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY || ''
)
export const algoliaIndex = algolia.initIndex('bulk-space-media-lab')
export const sanityAlgolia = indexer(
  // The first parameter maps a Sanity document type to its respective Algolia
  // search index. In this example both `post` and `article` Sanity types live
  // in the same Algolia index. Optionally you can also customize how the
  // document is fetched from Sanity by specifying a GROQ projection.
  //
  // In this example we fetch the plain text from Portable Text rich text
  // content via the pt::text function.
  //
  // _id and other system fields are handled automatically.
  {
    item: {
      index: algoliaIndex,
      projection: `{
        title,
        "path": slug.current,
        "easyName": easyName,
        "make": details.make,
        "model": details.model,
        "description": details.description,
        "categories": categories[]->title
      }`,
    },
    // For the article document in this example we want to resolve a list of
    // references to authors and get their names as an array. We can do this
    // directly in the GROQ query in the custom projection.
    user: {
      index: algoliaIndex,
      projection: `{
        "title": name,
        "email": contact.email,
        "phone": contact.phone,
      }`,
    },
  },

  // The second parameter is a function that maps from a fetched Sanity document
  // to an Algolia Record. Here you can do further mutations to the data before
  // it is sent to Algolia.
  (document: SanityDocumentStub) => {
    // switch (document._type) {
    //   case 'item':
    //     return {
    //       title: document.heading,
    //       body: document.body,
    //       authorNames: document.authorNames,
    //     }
    //   default:
    //     return document
    // }
    return document
  },
  // Visibility function (optional).
  //
  // The third parameter is an optional visibility function. Returning `true`
  // for a given document here specifies that it should be indexed for search
  // in Algolia. This is handy if for instance a field value on the document
  // decides if it should be indexed or not. This would also be the place to
  // implement any `publishedAt` datetime visibility rules or other custom
  // visibility scheme you may be using.
  (document: SanityDocumentStub) => {
    if (document.hasOwnProperty('isHidden')) {
      return !document.isHidden
    }
    return true
  }
)
