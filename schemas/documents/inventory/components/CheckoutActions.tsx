import { Card, Inline, Button } from '@sanity/ui'

export const CheckoutActionsInputComponent = (props) => {
  console.log({ props })

  const { draft, published, onComplete } = props

  console.log({ draft, published, onComplete })

  return (
    <Card>
      <Inline space={2}>
        <Button text="Start Checkout" tone="primary" mode="default" />
        <Button text="Complete Return" tone="positive" mode="ghost" disabled />
      </Inline>
    </Card>
  )
}
