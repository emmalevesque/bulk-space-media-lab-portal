import { useInventory } from 'plugins/inventory-workflow/hooks/hooks/useInventory'

export const ItemBadge = (props) => {
  const { itemStateProps } = useInventory(props?.published || props?.latest)

  return {
    ...itemStateProps,
  }
}
