/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import deskStructure from 'plugins/deskStructure'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import category from 'schemas/documents/inventory/category'
import item from 'schemas/documents/inventory/item'
import kit from 'schemas/documents/inventory/kit'
import staff from 'schemas/documents/user/staff'
import tag from 'schemas/documents/inventory/tag'
import user from 'schemas/documents/user/user'
import { schema } from 'schemas/schema'

import 'styles/studio.css'
import checkout from 'schemas/documents/inventory/checkout'
import { previewDocumentNode } from 'plugins/previewPane'
import MenuPreviewPane from 'schemas/components/preview/MenuPreviewPane'
import NavigationStructure from 'tools/Navigation/NavigationStructure'
import documentActions from 'plugins/documentActions'
import documentBadges from 'plugins/documentBadges'
import settings from 'schemas/singletons/settings'
import menu from 'schemas/singletons/menu'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Next.js Blog with Sanity.io'

export const singletonDocumentTypes: string[] = ['menu', 'settings']

export const documentPreviewPanes: {
  [key: string]: { component: React.FC }
}[] = [
  {
    menu: {
      component: MenuPreviewPane,
    },
    category: {
      component: MenuPreviewPane,
    },
  },
]

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: schema,
    templates: (prev) => {
      const categoryChild = {
        id: 'category-child',
        title: 'Category: Child',
        schemaType: 'category',
        parameters: [{ name: `parentId`, title: `Parent ID`, type: `string` }],
        // This value will be passed-in from desk structure
        value: ({ parentId }: { parentId: string }) => ({
          parent: { _type: 'reference', _ref: parentId },
        }),
      }

      return [...prev, categoryChild]
    },
  },
  tools: [NavigationStructure()],
  plugins: [
    deskTool({
      structure: (S, context) =>
        deskStructure(
          S,
          [
            menu,
            item,
            kit,
            S.divider(),
            checkout,
            S.divider(),
            category,
            tag,
            S.divider(),
            user,
            staff,
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
  ],
  document: {
    actions: documentActions,
    badges: documentBadges,
  },
})
