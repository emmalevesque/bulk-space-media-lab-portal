/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
// plugins
import {
  embeddingsIndexDashboard,
  embeddingsIndexReferenceInput,
} from '@sanity/embeddings-index-ui'
import { visionTool } from '@sanity/vision'
import { apiVersion, projectId } from 'lib/sanity.api'
import { deskStructure } from '@/sanity-plugin-bulk-space-portal'
import { defineConfig, isDev } from 'sanity'

// schema related items
import category from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/category'
import item from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/item'
import kit from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/kit'
import tag from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/tag'
import staff from '@/sanity-plugin-bulk-space-portal/schemas/documents/user/staff'
import user from '@/sanity-plugin-bulk-space-portal/schemas/documents/user/user'
import { schema } from '@/sanity-plugin-bulk-space-portal/schemas/schema'

import {
  checkoutActions,
  getCheckoutStatusProps,
} from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useCheckout'

import { templates } from 'lib/sanity.templates'

import { TITLE } from 'lib/constants'

import Icon from '@/sanity-plugin-bulk-space-portal/components/Icon/Icon'
import { structureTool } from 'sanity/structure'
import checkout from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/checkout'
import settings from '@/sanity-plugin-bulk-space-portal/schemas/singletons/settings'
import 'styles/studio.css'

const plugins = [
  embeddingsIndexReferenceInput(),
  structureTool({
    title: 'Manage',
    structure: (S, context) =>
      deskStructure(
        S,
        [
          {
            type: 'list',
            title: 'Manage Checkouts',
            icon: checkout.icon,
            typeDefs: [
              {
                ...checkout,
                title: 'All Checkouts',
                icon: checkout.icon,
              },
              {
                ...checkout,
                title: 'Pending Checkouts',
                icon: getCheckoutStatusProps(null, 'PENDING').icon,
              },
              {
                ...checkout,
                title: 'Hot Checkouts',
                icon: getCheckoutStatusProps(null, 'CHECKED_OUT').icon,
              },
              {
                ...checkout,
                title: 'Cold Checkouts',
                icon: getCheckoutStatusProps(null, 'RETURNED').icon,
              },
            ],
          },
          S.divider(),
          {
            type: 'list',
            title: 'Manage Inventory',
            icon: item.icon,
            typeDefs: [
              {
                type: 'list',
                title: 'Inventory Items',
                icon: item.icon,
                typeDefs: [
                  {
                    ...item,
                    title: 'All Items',
                  },
                  {
                    ...item,
                    title: 'Available Items',
                    icon: checkoutActions.RETURNED.emoji,
                  },
                  {
                    ...item,
                    title: 'Unavailable Items',
                    icon: checkoutActions.CHECKED_OUT.emoji,
                  },
                  {
                    ...item,
                    title: 'All Variants',
                    icon: checkoutActions.DEFAULT.emoji,
                  },
                ],
              },
              kit,
              category,
              tag,
            ],
          },
          {
            ...user,
          },
          {
            type: 'list',
            title: 'Settings',
            icon: settings.icon,
            typeDefs: [staff],
          },
          S.divider(),
        ],
        context
      ),
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
  schema: {
    types: schema,
    templates,
  },
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
