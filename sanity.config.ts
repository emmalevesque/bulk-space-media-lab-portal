/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import itemType from 'schemas/documents/item'
import { schema } from 'schemas/schema'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Next.js Blog with Sanity.io'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: schema,
  },
  plugins: [
    deskTool({}),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    // Add the "Open preview" action
    /*** */
    // productionUrl({
    //   apiVersion,
    //   previewSecretId,
    //   types: [postType.name, settingsType.name],
    // }),
    /***** */
    // Add an image asset source for Unsplash
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
