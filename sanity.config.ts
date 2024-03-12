/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { bulkSpacePortal } from '@/sanity-plugin-bulk-space-portal'
import Icon from '@/sanity-plugin-bulk-space-portal/components/global/Icon/Icon'
import { structureConfig } from '@/sanity-plugin-bulk-space-portal/structure/structure'
import {
  embeddingsIndexDashboard,
  embeddingsIndexReferenceInput,
} from '@sanity/embeddings-index-ui'
import { visionTool } from '@sanity/vision'
import { TITLE } from 'lib/constants'
import { apiVersion, projectId } from 'lib/sanity.api'
import { defineConfig, isDev } from 'sanity'
import { structureTool } from 'sanity/structure'
import 'styles/studio.css'

const plugins = [
  bulkSpacePortal(),
  embeddingsIndexReferenceInput(),
  structureTool({
    title: 'Manage',
    structure: structureConfig,
    // defaultDocumentNode: previewDocumentNode(),
  }),
  ...[
    process.env.NODE_ENV === 'development'
      ? embeddingsIndexDashboard()
      : { name: 'embeddings-index-dashboard-disabled' },
  ],
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
  ...[
    process.env.NODE_ENV === 'development'
      ? visionTool({ defaultApiVersion: apiVersion })
      : { name: 'vision-disabled' },
  ],
]

const commonConfig = {
  // The project ID you find in your sanity.json
  projectId,
  plugins: isDev
    ? plugins
    : plugins.filter((plugin) => plugin.name !== 'vision'),
  icon: Icon,
}

// the basePath values here are extremely important
// they're used to determine the QR Code urls
// They must match the dataset name
export default defineConfig([
  {
    basePath: '/studio/production',
    name: 'production',
    dataset: 'production',
    title: `${TITLE}`,
    ...commonConfig,
  },
  {
    basePath: '/studio/demo',
    name: 'demo',
    dataset: 'demo',
    title: `Demo Data`,
    ...commonConfig,
  },
])
