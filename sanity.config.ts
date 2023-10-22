/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
// plugins
import { visionTool } from '@sanity/vision'
import { apiVersion, projectId } from 'lib/sanity.api'
import { defineConfig } from 'sanity'
import deskStructure from 'plugins/deskStructure'
import { deskTool } from 'sanity/desk'

// schema related items
import { schema } from 'schemas/schema'
import category from 'schemas/documents/inventory/category'
import item from 'schemas/documents/inventory/item'
import kit from 'schemas/documents/inventory/kit'
import staff from 'schemas/documents/user/staff'
import tag from 'schemas/documents/inventory/tag'
import user from 'schemas/documents/user/user'

import checkout from 'schemas/documents/inventory/checkout'
import { previewDocumentNode } from 'plugins/previewPane'
import documentActions from 'plugins/documentActions'
import settings from 'schemas/singletons/settings'
import {
  checkoutActions,
  getCheckoutStatusProps,
} from 'schemas/documents/inventory/hooks/useCheckout'

import { templates } from 'lib/constants'

import { TITLE } from 'lib/constants'

import 'styles/studio.css'
import PortalDemo from 'tools/PortalDemo/PortalDemo'

const document = {
  actions: documentActions,
}

const tools = [PortalDemo]

const plugins = [
  deskTool({
    title: 'Manage',
    structure: (S, context) =>
      deskStructure(
        S,
        [
          {
            ...checkout,
            title: 'New Checkout',
            icon: checkoutActions.NEW.emoji,
          },
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
            icon: kit.icon,
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
                ],
              },
              kit,
              category,
              tag,
            ],
          },
          {
            type: 'list',
            title: 'Users',
            icon: user.icon,
            typeDefs: [user, staff],
          },
          S.divider(),
          settings,
        ],
        context
      ),
    defaultDocumentNode: previewDocumentNode(),
  }),
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
]

const commonConfig = {
  // The project ID you find in your sanity.json
  projectId,
  schema: {
    types: schema,
    templates,
  },
  tools,
  plugins,
  document,
}

// the basePath values here are extremely important
// they're used to determine the QR Code urls
// They must match the dataset name
export default defineConfig([
  {
    basePath: '/studio/demo',
    name: 'demo',
    dataset: 'demo',
    title: `Demo Data`,
    ...commonConfig,
  },
  {
    basePath: '/studio/production',
    name: 'production',
    dataset: 'production',
    title: `${TITLE}`,
    ...commonConfig,
  },
])
