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
import deskStructure from 'plugins/deskStructure'
import { defineConfig, isDev } from 'sanity'

// schema related items
import category from 'schemas/documents/inventory/category'
import item from 'schemas/documents/inventory/item'
import kit from 'schemas/documents/inventory/kit'
import tag from 'schemas/documents/inventory/tag'
import staff from 'schemas/documents/user/staff'
import user from 'schemas/documents/user/user'
import { schema } from 'schemas/schema'

import documentActions from 'plugins/documentActions'
import InventoryStatsTool from 'plugins/tools/InventoryStatsTool'
import {
  checkoutActions,
  getCheckoutStatusProps,
} from 'schemas/documents/inventory/hooks/useCheckout'

import { templates } from 'lib/sanity.templates'

import Icon from 'components/Icon'
import { CheckoutBadge } from 'plugins/documentBadges/CheckoutBadge'
import { ItemBadge } from 'plugins/documentBadges/ItemBadge'
import ReportsTool from 'plugins/tools/ReportsTool'
import checkout from 'schemas/documents/inventory/checkout'
import settings from 'schemas/singletons/settings'
import 'styles/studio.css'
import { structureTool } from 'sanity/structure'

const document = {
  actions: documentActions,
  templates: templates,
  // TODO: add item badge that shows if item is available or not
  badges: (prev, context) =>
    context.schemaType === 'checkout'
      ? [CheckoutBadge]
      : context.schemaType === 'item'
      ? [ItemBadge]
      : prev,
}

const tools = (prev, context) => {
  const canManageEmbeddingsIndex = context.currentUser?.roles
    .map((role) => role.name)
    .some((roleName) => ['administrator', 'developer'].includes(roleName))

  const canViewInventoryStats = context.currentUser?.roles
    .map((role) => role.name)
    .some((roleName) => ['administrator', 'developer'].includes(roleName))

  const availableTools = [...prev, InventoryStatsTool(), ReportsTool()]

  return !canViewInventoryStats && !canManageEmbeddingsIndex
    ? [...prev.filter((tool) => tool.name !== 'embeddings-index')]
    : !canViewInventoryStats && canManageEmbeddingsIndex
    ? [...availableTools.filter((tool) => tool.name !== 'inventory-stats')]
    : !canManageEmbeddingsIndex && canViewInventoryStats
    ? [...availableTools.filter((tool) => tool.name !== 'embeddings-index')]
    : [...availableTools]
}

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
  tools,
  plugins: isDev
    ? plugins
    : plugins.filter((plugin) => plugin.name !== 'vision'),
  document,
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
    title: `Bulk Space`,
    ...commonConfig,
  },
  {
    basePath: '/studio/media-lab',
    name: 'media-lab',
    dataset: 'media-lab',
    title: `Media Lab`,
    ...commonConfig,
  },
  {
    basePath: '/studio/media-lab',
    name: 'media-lab',
    dataset: 'media-lab',
    title: `Media Lab`,
    ...commonConfig,
  },
  {
    basePath: '/studio/preview',
    name: 'preview',
    dataset: 'preview',
    title: `Preview`,
    ...commonConfig,
  },
])
