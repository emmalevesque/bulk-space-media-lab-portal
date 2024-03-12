import { Button, Card, CardTone, Flex, Inline, Stack, Text } from '@sanity/ui'

import { set } from 'sanity'

export const parseReadableDate = (value) => {
  const now = new Date().getTime()

  const date = new Date(value)
  console.log({ date })

  const diff = Math.abs(now - date.getTime())

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)

  let readableDate = `${days ? `${days} days ` : ''}${
    hours ? `${hours} hours ` : ''
  }${minutes ? `${minutes} min ` : ''}`

  readableDate = `${readableDate || 'Just now'} ${
    !readableDate ? '' : date.getTime() < now ? 'ago' : 'from now'
  }`

  return readableDate
}

export const useReadableDate = (value) => {
  const now = new Date().getTime()

  const date = new Date(value)

  const diff = Math.abs(now - date.getTime())

  const isPast = date.getTime() < now

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)

  const readableDate = parseReadableDate(value)

  const tone = isPast
    ? 'default'
    : days > 1
    ? 'positive'
    : days < 1
    ? 'caution'
    : hours < 1
    ? 'critical'
    : 'default'

  return {
    readableDate,
    isPast,
    tone,
  } as {
    readableDate: string
    isPast: boolean
    tone: CardTone
  }
}

export const ReadableDatetime = (
  props,
  options = {
    showTone: true,
  }
) => {
  const { value } = props

  const { readableDate, tone } = useReadableDate(value)

  const optionalProps = {
    ...(options?.showTone && { tone }),
  }

  const handleNow = () => {
    props.onChange(set(new Date().toISOString()))
  }

  return (
    <Flex style={{ width: '100%' }}>
      <Stack space={2} style={{ width: '100%' }}>
        <Flex gap={2}>
          {props?.renderDefault(props)}
          <Button
            type="button"
            mode="ghost"
            tone="default"
            paddingY={0}
            paddingX={2}
            className=" font-bold"
            onClick={handleNow}
          >
            Now
          </Button>
        </Flex>
        <Card paddingY={1} paddingX={1} {...optionalProps}>
          <Inline padding={2}>
            <Text>{readableDate}</Text>
          </Inline>
        </Card>
      </Stack>
    </Flex>
  )
}
