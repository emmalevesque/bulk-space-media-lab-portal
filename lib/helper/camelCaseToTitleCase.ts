export const camelCaseToTitleCase = (str: string) => {
  if (!str) return ''
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
