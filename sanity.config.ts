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
  embeddingsIndexReferenceInput(),
  structureTool({
    title: 'Manage',
    structure: structureConfig,
    // defaultDocumentNode: previewDocumentNode(),
  }),
  bulkSpacePortal(),
  // if we're in development, we want to enable the embeddings index dashboard
  // as well as the vision tool
  ...[
    isDev
      ? [
          embeddingsIndexDashboard(),
          visionTool({ defaultApiVersion: apiVersion }),
        ]
      : [{ name: 'embeddings-index-dashboard-disabled' }],
  ].flat(), // flatten the array otherwise we'd have two levels
]

// create a common config to use between workspaces
const commonConfig = {
  // The project ID you find in your sanity.json
  projectId,
  plugins,
  icon: Icon,
}

// the basePath values here are extremely important
// they're used to determine the QR Code urls
// They must match the dataset name
export default defineConfig([
  {
    ...commonConfig,
    basePath: '/studio/production',
    name: 'production',
    dataset: 'production',
    title: `${TITLE}`,
  },
  {
    ...commonConfig,
    basePath: '/studio/demo',
    name: 'demo',
    dataset: 'demo',
    title: `Demo Data`,
  },
])
