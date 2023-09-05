import { BadgeTone, Button, Card, Grid, Stack } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { set, unset } from 'sanity'
import { uuid } from '@sanity/uuid'
import ConfirmAddDialog from './ConfirmAddDialog'
import { QrScannerProvider } from './hooks/useQrScanner'

export default (props) => {
  const { onChange, value: currentValue, schemaType } = props
  const [showScanner, setShowScanner] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const [itemToBeAdded, setItemToBeAdded] = useState<string>('')
  const [triggerAddItem, setTriggerAddItem] = useState<boolean>(false)
  const [result, setResult] = useState('No result')

  const handleWarn = () => {
    setOpen(true)
  }

  const handleAddToCheckout = useCallback(() => {
    // check if there's a ? in the string

    if (!itemToBeAdded) return

    const newReference = {
      //  if it's a weak reference, set it to weak
      _weak: schemaType.name === 'array' ? true : undefined,
      _key: schemaType.name === 'array' ? uuid() : undefined,
      _type: 'reference',
      _ref: itemToBeAdded,
    }

    // if it's not an array field
    if (schemaType.name === 'reference') {
      return onChange(newReference ? set(newReference) : unset())
      // if it is an array field
    } else if (schemaType.name === 'array') {
      if (!currentValue)
        return onChange(newReference ? set([newReference]) : unset())

      if (Array.isArray(currentvalue) && currentvalue.length > 1) {
        return onChange(
          newReference ? set([...currentvalue, newReference]) : unset()
        )
      }
    }
  }, [itemToBeAdded, triggerAddItem])

  useEffect(() => {
    console.log({ itemToBeAdded })
  }, [itemToBeAdded])

  useEffect(() => {
    console.log({ triggerAddItem })
  }, [triggerAddItem])

  useEffect(() => {
    if (triggerAddItem) {
      itemToBeAdded && handleAddToCheckout()
    }
  }, [triggerAddItem, handleAddToCheckout])

  const handleScan = (data) => {
    console.log({ data })

    if (data && data?.includes('?')) {
      if (currentvalue?.map(({ _ref }) => _ref).includes(data?.split('?')[1])) {
        handleWarn()
      } else {
        setItemToBeAdded(data?.split('?')[1])
        setTriggerAddItem(true)
      }
    }
  }

  const handleError = (err) => {
    console.error(err)
    setTone('critical')
  }

  const [tone, setTone] = useState<BadgeTone>('default')

  const handleConfirm = () => {
    setTriggerAddItem(true)
    setOpen(false)
  }

  return (
    <QrScannerProvider value={{ handleAddToArray: handleAddToCheckout }}>
      <Card>
        <Grid paddingY={2} gap={2} columns={[1, 2]}>
          {props.renderDefault(props)}
          <Stack space={2}>
            <Grid padding={[1, 2]} columns={[1]}>
              <Stack space={1}>
                {showScanner ? (
                  <QrScanner
                    scanDelay={1000}
                    onError={handleError}
                    onDecode={handleScan}
                  />
                ) : null}
                <Button
                  onClick={() => setShowScanner(!showScanner)}
                  text={showScanner ? 'Hide Scanner' : 'Show Scanner'}
                />
                <Card padding={2} tone={tone}>
                  {showScanner ? result : null}
                </Card>
              </Stack>
            </Grid>
          </Stack>
        </Grid>
      </Card>
      <ConfirmAddDialog {...{ open, setOpen, onClose, handleConfirm }} />
    </QrScannerProvider>
  )
}
