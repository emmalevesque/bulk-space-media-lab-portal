import { defineType } from 'sanity'
import QrCode from 'schemas/documents/inventory/components/QrCode/QrCode'
import item from 'schemas/documents/inventory/item'
import user from 'schemas/documents/user/user'

export default defineType({
  name: 'qrCode',
  title: 'QR Code',
  type: 'reference',
  to: [{ type: user.name }, { type: item.name }],
  options: {
    filter: ({ document }) => {
      console.log({ document })

      return { filter: `_type == $type`, params: { type: document?._type } }
    },
  },
  components: {
    input: QrCode,
  },
})
