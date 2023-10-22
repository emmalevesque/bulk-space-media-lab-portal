'use client'
import { Box, Text } from '@sanity/ui'
import { redirect } from 'next/navigation'

export default function HomepageRoute() {
  redirect('/studio')
  return (
    <Box padding={4}>
      <Text size={2}>
        Please enjoy a moment of pause while we redirect you...{' '}
      </Text>
    </Box>
  )
}
