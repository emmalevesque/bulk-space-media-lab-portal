import { definePlugin } from 'sanity'

export default definePlugin({
  name: 'search',
  search: {
    unstable_enableNewSearch: true,
  },
})
