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
          import('schemas/documents/inventory/components/Item/ItemQrCodePane')
      ),
    },
  ],
  checkout: [
    {
      title: 'Related',
      component: dynamic(
        () => import('schemas/documents/inventory/components/RelatedDocuments')
      ),
    },
  ],
  kit: [],
  user: [
    {
      title: 'QR Code',
      component: dynamic(
        () =>
          import('schemas/documents/inventory/components/User/UserQrCodePane')
      ),
    },
  ],
  staff: [],
  category: [],
  tag: [],
  settings: [],
}

export const templates = (prev) => {
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
}
