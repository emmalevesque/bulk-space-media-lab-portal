import { useInventory } from '@/sanity-plugin-bulk-space-portal/schemas/documents/inventory/hooks/useInventory'

export const ItemBadge = (props) => {
  const { itemStateProps } = useInventory(props?.published)

  return {
    ...itemStateProps,
  }
}
