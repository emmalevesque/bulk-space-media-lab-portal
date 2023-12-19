import { Metadata } from 'next'
import { metadata as studioMetadata } from 'next-sanity/studio/metadata'
import { Studio } from './Studio'

import 'tailwindcss/tailwind.css'

export default function StudioPage() {
  return <Studio />
}

// Set the right `viewport`, `robots` and `referer` meta tags
export const metadata: Metadata = {
  ...studioMetadata,
}
