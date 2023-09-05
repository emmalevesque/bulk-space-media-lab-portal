import { Dialog, Box, Stack, Inline, Flex, Button, Text } from '@sanity/ui'

export type ConfirmAddDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onClose: () => void
  handleConfirm: () => void
}

export default (props: ConfirmAddDialogProps) => {
  const { open, setOpen, onClose, handleConfirm } = props

  const handleWarn = (data) => {
    setOpen(true)
  }

  const handleYesClick = () => {
    setOpen(false)
    handleConfirm()
  }

  const handleNoClick = () => {
    setOpen(false)
    onClose()
  }

  return open ? (
    <Dialog
      header="Are you sure?"
      id="dialog-example"
      onClose={onClose}
      onClickOutside={() => {}}
      open={open}
    >
      <Box padding={4}>
        <Stack space={4}>
          <Inline space={4}>
            <Text size={1} muted>
              Item already added, do you want to add it again?
            </Text>
            <Flex gap={2}>
              <Button onClick={handleConfirm} text="Yes" tone="positive" />
              <Button
                onClick={() => {
                  setOpen(false)
                  onClose()
                }}
                text="No"
                mode="ghost"
                tone={'critical'}
              />
            </Flex>
          </Inline>
        </Stack>
      </Box>
    </Dialog>
  ) : (
    <></>
  )
}
