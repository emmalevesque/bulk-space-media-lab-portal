import { Text, Heading, Stack } from '@sanity/ui'

const CheckoutFlow = (props) => {
  console.log({ props })

  return (
    <Stack space={4}>
      <Heading as="h3">Checkout</Heading>
      <Stack space={3}>
        <Text>Checkout flow goes here</Text>
      </Stack>
    </Stack>
  )
}

export default CheckoutFlow
