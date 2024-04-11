import { defineType } from 'sanity'
import QrCode from 'plugins/inventory-workflow/components/global/QrCode/QrCode'
import item from 'schemas/documents/inventory/item'
import user from 'schemas/documents/user/user'

export default defineType({
  name: 'qrCode',
  title: 'QR Code',
  type: 'reference',
  to: [{ type: user.name }, { type: item.name }],
  components: {
    input: QrCode,
  },
})
