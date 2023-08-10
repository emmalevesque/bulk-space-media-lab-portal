/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from "@sanity/vision";
import EmojiIcon from "components/Icon/Emoji";
import { apiVersion, dataset, projectId } from "lib/sanity.api";
import deskStructure from "plugins/deskStructure";
import { icon } from "plugins/navigation";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import category from "schemas/documents/inventory/category";
import item from "schemas/documents/inventory/item";
import kit from "schemas/documents/inventory/kit";
import staff from "schemas/documents/user/staff";
import tag from "schemas/documents/inventory/tag";
import user from "schemas/documents/user/user";
import { schema } from "schemas/schema";
import navigation from "schemas/singletons/menu";

import "styles/studio.css";
import checkout from "schemas/documents/inventory/checkout";
import CategoryPreviewPane from "schemas/components/preview/CategoryPreviewPane";

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "Next.js Blog with Sanity.io";

export const singletonDocumentTypes: string[] = ["menu"];

export const documentPreviewPanes: {
  [key: string]: { component: React.FC };
}[] = [
  {
    menu: {
      component: CategoryPreviewPane,
    },
  },
];

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: schema,
  },
  plugins: [
    deskTool({
      structure: (S) =>
        deskStructure(S, [
          {
            type: "list",
            title: "Inventory",
            icon: icon,
            typeDefs: [navigation],
          },
          S.divider(),
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
        ]),
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
});
