import { Badge, BadgeTone, Stack } from '@sanity/ui'
import { useState } from 'react'
import QrReader from 'react-qr-scanner'

export default (props) => {
  const delay = 100

  const [result, setResult] = useState('No result')

  const handleScan = (data) => {
    if (data) {
      setResult(data)
      setTone('positive')
    }
  }

  const handleError = (err) => {
    console.error(err)
    setTone('critical')
  }

  const previewStyle = {
    height: 240,
    width: 320,
  }

  const [tone, setTone] = useState<BadgeTone>('default')

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {/* <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      /> */}
      <Badge tone={tone}>{result}</Badge>
    </Stack>
  )
}
