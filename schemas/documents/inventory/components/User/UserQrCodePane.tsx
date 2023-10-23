import { Box } from '@sanity/ui'
import QRCode from 'react-qr-code'
import { useDataset } from 'sanity'

export default (props) => {
  const dataset = useDataset()

  const basePath = `/studio/${dataset}/desk`

  const document = props?.document?.displayed

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${basePath}/manageInventory;inventoryItems;allItems;c325264f-c613-43d4-a40d-2d5ffa2777c2`

  return document ? (
    <Box padding={4}>
      <QRCode value={url} />
    </Box>
  ) : null
}
