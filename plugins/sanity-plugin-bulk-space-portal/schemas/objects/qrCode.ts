import { defineType } from 'sanity'
import QrCode from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/components/QrCode'
import item from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/item'
import user from '@/sanity-plugin-bulk-space-portal/schemas/documents/user/user'

export default defineType({
  name: 'qrCode',
  title: 'QR Code',
  type: 'reference',
  to: [{ type: user.name }, { type: item.name }],
  components: {
    input: QrCode,
  },
})
