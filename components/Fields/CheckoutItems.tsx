import { QrScanner } from '@yudiel/react-qr-scanner'
import { TokenIcon } from '@sanity/icons'
import { Button, Dialog, Stack, useToast } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { set, type InputProps } from 'sanity'
import { uuid } from '@sanity/uuid'

type Props = InputProps

export default function CheckoutItemsInput(props: Props) {
  const { onChange, value } = props

  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const toast = useToast()

  useEffect(() => {
    if (lastScanned !== null) {
      console.log({ lastScanned })

      const newValue = Array.isArray(value)
        ? [
            ...value,
            {
              _weak: true,
              _key: uuid(),
              _type: 'reference',
              _ref: lastScanned.split(';').pop(),
            },
          ]
        : [
            {
              _weak: true,
              _key: uuid(),
              _type: 'reference',
              _ref: lastScanned.split(';').pop(),
            },
          ]

      onChange(set(newValue))
      setLastScanned(null)
      // onChange(set(lastScanned))
    } else {
      // onChange(unset())
    }
  }, [lastScanned, onChange, value])

  const onClick = () => {
    setShowDialog(true)
  }

  const onClose = () => {
    setShowDialog(false)
  }

  const ScanQrCodeDialog = () => {
    const onScan = (data) => {
      if (data.text && lastScanned !== data.text) {
        setLastScanned(data.text)
        setShowDialog(false)
        toast.push({
          closable: true,
          status: 'success',
          title: 'Added successfully',
        })
        return
      }
      return
    }

    const onError = (error) => {
      toast.push({
        closable: true,
        status: 'error',
        title: 'There was an error, please try again.',
        description: error.message,
      })
    }

    return (
      <Dialog
        header="Scan QR Code"
        id="scan-qr-code-dialog"
        onClose={onClose}
        open={true}
      >
        <Stack space={2}>
          <QrScanner onError={onError} onResult={onScan} />
        </Stack>
      </Dialog>
    )
  }

  return (
    <Stack space={2}>
      {props?.renderDefault(props)}
      <Button
        icon={TokenIcon}
        mode="ghost"
        text="Scan QR Code"
        onClick={onClick}
      />
      {showDialog && <ScanQrCodeDialog />}
    </Stack>
  )
}
