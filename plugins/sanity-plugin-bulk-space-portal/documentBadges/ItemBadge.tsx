import { useInventory } from 'schemas/documents/inventory/hooks/useInventory'

export const ItemBadge = (props) => {
  const { itemStateProps } = useInventory(props?.published)

  return {
    ...itemStateProps,
  }
}
