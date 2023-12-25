import 'tailwindcss/tailwind.css'
import { Studio } from './Studio'

import { Viewport } from 'next'
import { viewport as nextSanityViewport } from 'next-sanity/studio/viewport'
// Ensures the Studio route is statically generated
export const dynamic = 'force-static'

// Set the right `viewport`, `robots` and `referer` meta tags
export { metadata } from 'next-sanity/studio/metadata'
export const viewport: Viewport = {
  ...nextSanityViewport,
  themeColor: '#1f212b',
}

export default function StudioPage() {
  return <Studio />
}
