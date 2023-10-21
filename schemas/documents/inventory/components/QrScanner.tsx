import { BadgeTone, Button, Card, Grid, Stack } from '@sanity/ui'
import { useCallback, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { set, unset } from 'sanity'

export default (props) => {
  const { onChange } = props
  const [showScanner, setShowScanner] = useState<boolean>(false)

  const [result, setResult] = useState('No result')

  const handleScan = useCallback(
    (data) => {
      if (data) {
        const id = data.split(';').pop()
        setResult(id)
        setTone('positive')

        const newReference = {
          _type: 'reference',
          _ref: id,
        }

        onChange(newReference._ref ? set(newReference) : unset())
      }
    },
    [onChange]
  )

  const handleError = useCallback((err) => {
    console.error(err)
    setTone('critical')
  }, [])

  const [tone, setTone] = useState<BadgeTone>('default')

  return (
    <Card>
      <Grid paddingY={2} columns={[1]}>
        {props.renderDefault(props)}
        <Stack space={2}>
          <Grid paddingY={2} columns={[1]}>
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
