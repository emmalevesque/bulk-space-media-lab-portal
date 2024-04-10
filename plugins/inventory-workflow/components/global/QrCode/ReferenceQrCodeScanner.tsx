import {
  BadgeTone,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Stack,
} from '@sanity/ui'
import { uuid } from '@sanity/uuid'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { set, unset } from 'sanity'

export default (props) => {
  const { onChange, schemaType } = props
  const [toBeAdded, setToBeAdded] = useState<any>(null)

  const [open, setOpen] = useState(false)

  const onOpen = useCallback(async () => {
    setOpen(true)
  }, [])
  const onClose = useCallback(() => setOpen(false), [])

  const handleAddToCheckout = useCallback(
    (data) => {
      const itemToBeAdded = data ? data?.split(';').pop() : null

      if (!itemToBeAdded) return

      const newReference = {
        //  if it's a weak reference, set it to weak
        _weak: schemaType.name === 'array' ? true : undefined,
        _key: schemaType.name === 'array' ? uuid() : undefined,
        _type: 'reference',
        _ref: itemToBeAdded,
      }

      setToBeAdded(newReference)

      return
    },
    [schemaType.name]
  )

  const handleConfirm = useCallback(() => {
    console.log('confirmed')
    onChange(toBeAdded ? set(toBeAdded) : unset())
    onClose()
  }, [onClose, onChange, toBeAdded])

  const handleScan = useCallback(handleAddToCheckout, [handleAddToCheckout])

  const handleError = (err) => {
    console.error(err)
    setTone('critical')
  }

  useEffect(() => {
    if (open) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toBeAdded, onClose])

  const [tone, setTone] = useState<BadgeTone>('default')

  const RenderQrScanner = (props) => {
    const QrReader = dynamic(() => import('./QrScanner'), {
      ssr: false,
    })
    return <QrReader {...props} />
  }

  return (
    <>
      <Card className="bg-white">
        <Grid paddingY={2} gap={2} columns={[1]}>
          {props?.renderDefault(props)}
          <Stack space={2}>
            <Grid paddingY={[1]} columns={[1]}>
              <Stack space={1}>
                <Button
                  onClick={onOpen}
                  tone={tone}
                  text={open ? 'Hide Scanner' : 'Show Scanner'}
                />
              </Stack>
            </Grid>
          </Stack>
        </Grid>
      </Card>
      {open && !toBeAdded && (
        <Dialog header="Scan QR Code" onClose={onClose} id={'add-item'}>
          <RenderQrScanner
            scanDelay={300}
            onError={handleError}
            onDecode={handleScan}
          />
        </Dialog>
      )}
      {toBeAdded ? (
        <Dialog header="Confirm Add?" onClose={onClose} id={'add-item'}>
          <Box padding={5}>
            <Flex align="center" gap={3} justify="center">
              <Button
                tone="primary"
                onClick={() => {
                  setToBeAdded(null)
                  handleConfirm()
                }}
                text="Confirm"
              />

              <Button
                onClick={() => {
                  setToBeAdded(null)
                }}
                tone="default"
                text="Cancel"
              />
            </Flex>
          </Box>
        </Dialog>
      ) : null}
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
