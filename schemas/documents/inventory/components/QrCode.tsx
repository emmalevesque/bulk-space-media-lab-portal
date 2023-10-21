import { Stack, TextInput } from '@sanity/ui'
import { id } from 'date-fns/locale'
import QRCode from 'react-qr-code'
import { useFormValue } from 'sanity'

export default (props) => {
  const id = useFormValue(['_id']) as string

  const qrCodeText = {
    _type: 'reference',
    _ref: id,
  }

  const endpoint = `/api/qr-code/${id}`

  return (
    <Stack space={2}>
      <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL}?${id}`} />
    </Stack>
  )
}
