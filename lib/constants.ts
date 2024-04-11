import dynamic from 'next/dynamic'

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
export const TITLE =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Bulk Space'

export const DESK_NAME = 'Manage'

export const DESK_BASE_PATH = '/manage'

export const singletonDocumentTypes: string[] = ['menu', 'settings']

export const typesWithCustomFilters: string[] = ['checkout', 'item']

export const documentPreviewPanes: {
  [key: string]: {
    component: React.ComponentType<any>
    title: string
  }[]
} = {
  item: [
    {
      title: 'QR Code',
      component: dynamic(
        () =>
          import('plugins/inventory-workflow/components/item/ItemQrCodePane')
      ),
    },
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  checkout: [
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  kit: [
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  user: [
    {
      title: 'QR Code',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/QrCode/UserQrCodePane'
          )
      ),
    },
  ],
  staff: [
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  category: [
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  tag: [
    {
      title: 'Related',
      component: dynamic(
        () =>
          import(
            'plugins/inventory-workflow/components/global/RelatedDocuments'
          )
      ),
    },
  ],
  settings: [],
}
