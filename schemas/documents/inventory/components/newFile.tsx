import { Stack } from '@sanity/ui'
import QRCode from 'react-qr-code'
import { useFormValue } from 'sanity'

export default () => {
  const id = useFormValue(['_id']) as string

  const endpoint = `/api/qr-code/${id}`

  return (
    <Stack space={2}>
      <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL}?${id}`} />
    </Stack>
  )
}
