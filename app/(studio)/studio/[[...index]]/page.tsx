import { Metadata } from 'next'
import { Studio } from './Studio'
import { metadata as studioMetadata } from 'next-sanity/studio/metadata'

import 'tailwindcss/tailwind.css'

export default function StudioPage() {
  return <Studio />
}

// Set the right `viewport`, `robots` and `referer` meta tags
export const metadata: Metadata = {
  ...studioMetadata,
  // Overrides the viewport to resize behavior
  viewport: `${studioMetadata.viewport}, interactive-widget=resizes-content`,
}
