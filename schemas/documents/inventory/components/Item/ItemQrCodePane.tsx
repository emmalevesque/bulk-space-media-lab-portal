import { Card, Flex } from '@sanity/ui'
import { useQRCode } from 'next-qrcode'
import { useDataset } from 'sanity'

export default (props) => {
  const { SVG } = useQRCode()

  const dataset = useDataset()

  const basePath = `/studio/${dataset}/desk`

  const document = props?.document?.displayed

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${basePath}/manageInventory;inventoryItems;allItems;${document._id}`

  return document ? (
    <Flex padding={4}>
      <Card padding={3} style={{ backgroundColor: 'white' }}>
        {/* <QRCode value={url} /> */}
        <SVG
          text={url}
          options={{
            margin: 1,
            width: 500,
            color: { dark: '#00F', light: '#FFF' },
          }}
        />
      </Card>
    </Flex>
  ) : null
}
