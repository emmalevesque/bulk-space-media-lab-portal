import { useInventory } from 'schemas/documents/inventory/hooks/useInventory'

export const ItemBadge = (props) => {
  if (props?.published) {
    const { itemStateProps } = useInventory(props?.published)

    return {
      ...itemStateProps,
    }
  } else {
    return {
      label: 'Reading Inventory',
      title: 'Please wait while we read the inventory status',
      color: 'default',
    }
  }
}
