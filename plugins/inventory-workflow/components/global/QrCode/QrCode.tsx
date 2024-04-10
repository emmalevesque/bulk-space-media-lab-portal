import { Card, Stack } from '@sanity/ui'
import QRCode from 'react-qr-code'
import { useFormValue } from 'sanity'

export default () => {
  const id = useFormValue(['_id']) as string

  // TODO: the qrcode should also be able to function as a link to the editor page
  return (
    <Stack space={2}>
      <Card padding={3} style={{ backgroundColor: 'white' }}>
        <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL}?${id}`} />
      </Card>
    </Stack>
  )
}
