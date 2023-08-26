import { Badge, BadgeTone, Button, Card, Grid, Inline, Stack } from '@sanity/ui'
import { useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { FormBuilderInputComponentMap, set, unset } from 'sanity'

export default (props) => {
  const { onChange, value, schemaType } = props
  const [showScanner, setShowScanner] = useState<boolean>(false)

  console.log({ schemaType })

  const delay = 100

  const [result, setResult] = useState('No result')

  const handleScan = (data) => {
    if (data) {
      const id = data.split('?')[1]
      setResult(id)
      setTone('positive')

      const newReference = {
        _type: 'reference',
        _ref: id,
      }

      onChange(newReference._ref ? set(newReference) : unset())
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

  console.log({ result })

  return (
    <Card>
      <Grid paddingY={2} columns={[1, 2]}>
        {props.renderDefault(props)}
        <Stack space={2}>
          <Grid paddingX={2} columns={[1]}>
            <Stack space={1}>
              {showScanner ? (
                <QrScanner onError={handleError} onDecode={handleScan} />
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
  )
}
