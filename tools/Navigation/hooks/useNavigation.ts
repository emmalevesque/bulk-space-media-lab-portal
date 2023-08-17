import { SyntheticEvent, useState } from 'react'

export const useNavigation = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleCategoryClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setActiveCategory(event.currentTarget.dataset.category || null)
  }

  return {
    activeCategory,
    handleCategoryClick,
  }
}
