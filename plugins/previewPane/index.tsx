// This plugin is responsible for adding a “Preview” tab to the document pane
// You can add any React component to `S.view.component` and it will be rendered in the pane
// and have access to content in the form in real-time.
// It's part of the Studio's “Structure Builder API” and is documented here:
// https://www.sanity.io/docs/structure-builder-reference

import { DefaultDocumentNodeResolver } from 'sanity/desk'
import category from 'schemas/documents/inventory/category'

import menu from 'schemas/singletons/menu'
import MenuPreviewPane from 'schemas/components/preview/MenuPreviewPane'

export const previewDocumentNode = (): DefaultDocumentNodeResolver => {
  return (S, { schemaType }) => {
    switch (schemaType) {
      case category.name:
        return S.document().views([
          S.view.form(),
          S.view.component(MenuPreviewPane).title('Preview'),
        ])

      case menu.name:
        return S.document().views([
          S.view.form(),
          S.view.component(MenuPreviewPane).title('Preview'),
        ])
      default:
        return null
    }
  }
}
