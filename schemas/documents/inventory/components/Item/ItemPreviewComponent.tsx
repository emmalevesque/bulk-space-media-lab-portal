import { Badge, Flex } from '@sanity/ui'

export default (props) => {
  console.log({ props })

  const badge = props?.stock > 0 ? 'In Stock' : 'Out of Stock'

  if (!props?.stock) return null

  return (
    <Flex padding={2} className="w-hull h-full">
      <div className="flex h-full w-full flex-row items-center  justify-between">
        {props?.renderDefault(props)}
        <Badge mode="outline" tone={props?.stock > 0 ? 'positive' : 'critical'}>
          {badge}
        </Badge>
      </div>
    </Flex>
  )
}
