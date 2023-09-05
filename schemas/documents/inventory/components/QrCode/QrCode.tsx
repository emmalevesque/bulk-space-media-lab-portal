import { Stack, TextInput } from '@sanity/ui'
import { id } from 'date-fns/locale'
import QRCode from 'react-qr-code'
import { useFormValue } from 'sanity'

export default (props) => {
  console.log({ props })

  const id = useFormValue(['_id']) as string

  const idNotDraft = id.replace('drafts.', '')

  const qrValue = `${process.env.NEXT_PUBLIC_BASE_URL}?${idNotDraft}`

  console.log({ qrValue })

  return (
    <Stack padding={4} style={{ backgroundColor: 'white' }} space={2}>
      <QRCode value={qrValue} />
    </Stack>
  )
}
