import { Box, Heading } from '@sanity/ui'

export default function PortalRentPage(props) {
  console.log({ props })

  return (
    <Box padding={2}>
      <Heading as={`h2`} size={2}>
        Rent Equipment
      </Heading>
    </Box>
  )
}
