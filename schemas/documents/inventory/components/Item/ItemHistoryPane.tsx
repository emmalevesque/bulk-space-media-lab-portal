import { Box } from '@sanity/ui'

export default (props) => {
  console.log({ props })

  return document ? (
    <Box padding={4}>This pane will show the items checkout history</Box>
  ) : null
}
