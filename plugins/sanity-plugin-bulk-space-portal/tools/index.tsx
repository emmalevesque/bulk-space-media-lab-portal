import InventoryStatsTool from './InventoryStatsTool'
import ReportsTool from './ReportsTool'

export const tools = (prev, context) => {
  const canManageEmbeddingsIndex = context.currentUser?.roles
    .map((role) => role.name)
    .some((roleName) => ['administrator', 'developer'].includes(roleName))

  const canViewInventoryStats = context.currentUser?.roles
    .map((role) => role.name)
    .some((roleName) => ['administrator', 'developer'].includes(roleName))

  const availableTools = [...prev, InventoryStatsTool(), ReportsTool()]

  return !canViewInventoryStats && !canManageEmbeddingsIndex
    ? [...prev.filter((tool) => tool.name !== 'embeddings-index')]
    : !canViewInventoryStats && canManageEmbeddingsIndex
    ? [...availableTools.filter((tool) => tool.name !== 'inventory-stats')]
    : !canManageEmbeddingsIndex && canViewInventoryStats
    ? [...availableTools.filter((tool) => tool.name !== 'embeddings-index')]
    : [...availableTools]
}
