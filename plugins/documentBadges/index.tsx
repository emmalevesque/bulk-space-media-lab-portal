// import { _readClient } from 'lib/sanity.client'
// import { groq } from 'next-sanity'

// export default (prev, context) => {
//   console.log({ context })

//   _readClient
//     .fetch(groq`*[_id == $documentId]`, { documentId: context?.documentId })
//     .then((document) => {
//       const { CheckoutBadge } = useCheckout(document)
//       return context.schemaType === 'checkout'
//         ? [{ ...CheckoutBadge }, ...prev]
//         : prev
//     })
// }
