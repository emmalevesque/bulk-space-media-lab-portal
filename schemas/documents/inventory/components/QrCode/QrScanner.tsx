import { BadgeTone, Button, Card, Grid, Stack } from '@sanity/ui'
import { useCallback, useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { set, unset } from 'sanity'
import { uuid } from '@sanity/uuid'

export default (props) => {
  const { onChange, value, schemaType } = props
  const [showScanner, setShowScanner] = useState<boolean>(false)
  const [itemToBeAdded, setItemToBeAdded] = useState<string>('')
  const [triggerAddItem, setTriggerAddItem] = useState<boolean>(false)
  const [result] = useState('No result')

  const handleAddToCheckout = useCallback(() => {
    if (!triggerAddItem) return

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
      if (!value) return onChange(newReference ? set([newReference]) : unset())

      if (Array.isArray(value) && value.length > 0) {
        return onChange(newReference ? set([...value, newReference]) : unset())
      }

      if (Array.isArray(value) && value.length === 0) {
        return onChange(newReference ? set([newReference]) : unset())
      }
    }
  }, [itemToBeAdded, triggerAddItem, onChange, schemaType.name, value])

  useEffect(() => {
    setTriggerAddItem(false)
  }, [value])

  useEffect(() => {}, [itemToBeAdded])

  useEffect(() => {}, [triggerAddItem])

  useEffect(() => {
    handleAddToCheckout()
  }, [triggerAddItem, handleAddToCheckout])

  const handleScan = (data) => {
    if (data && data?.includes('?')) {
      setItemToBeAdded(data?.split('?')[1])
      setTriggerAddItem(true)
    }
  }

  const handleError = (err) => {
    console.error(err)
    setTone('critical')
  }

  const [tone, setTone] = useState<BadgeTone>('default')

  return (
    <>
      <Card>
        <Grid paddingY={2} gap={2} columns={[1]}>
          {props.renderDefault(props)}
          <Stack space={2}>
            <Grid paddingY={[1]} columns={[1]}>
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
                  tone={showScanner ? 'critical' : 'positive'}
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
      {/* <ConfirmAddDialog
        {...{
          open,
          setOpen,
          onClose,
          handleConfirm,
          itemToBeAdded,
          value,
          onChange,
          set,
          unset,
          setTriggerAddItem,
          setItemToBeAdded,
        }}
      /> */}
    </>
  )
}
