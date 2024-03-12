'use client'
import { useState } from 'react'

export const useCategoryTree = () => {
  const [showChildren, setShowChildren] = useState<boolean>(false)

  const toggleShowChildren = () => {
    setShowChildren(!showChildren)
  }

  return {
    showChildren,
    toggleShowChildren,
  }
}
