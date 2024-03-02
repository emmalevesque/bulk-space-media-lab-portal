import 'tailwindcss/tailwind.css'
import { Studio } from './Studio'

import { Viewport } from 'next'
import { viewport as nextSanityViewport } from 'next-sanity/studio'
export const dynamic = 'force-static'

export { metadata } from 'next-sanity/studio/metadata'
export const viewport: Viewport = {
  ...nextSanityViewport,
  themeColor: '#13141b',
}

export default function StudioPage() {
  return <Studio />
}
