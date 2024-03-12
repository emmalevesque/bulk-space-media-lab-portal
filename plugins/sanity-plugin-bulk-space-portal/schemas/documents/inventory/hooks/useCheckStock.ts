import { groq } from 'next-sanity'
import { useClient } from 'sanity'

const query = groq`
  *[_type == "item" && (slug.current == $slug || _id == $slug) && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    stock,
  }
`

const client = useClient()

export const useCheckStock = async (
  slugOrId: string,
  quanityInCart?: number
) => {
  const stock = await client.fetch(query, { slug: slugOrId })

  return stock
}
