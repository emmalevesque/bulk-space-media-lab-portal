import { Button, Card, Inline } from '@sanity/ui'

export const CheckoutActionsInputComponent = (props) => {
  const { draft, published, onComplete } = props

  return (
    <Card>
      <Inline space={2}>
        <Button text="Start Checkout" tone="primary" mode="default" />
        <Button text="Complete Return" tone="positive" mode="bleed" disabled />
      </Inline>
    </Card>
  )
}
