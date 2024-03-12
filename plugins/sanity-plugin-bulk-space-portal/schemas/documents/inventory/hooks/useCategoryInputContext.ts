import { createContext, useContext } from 'react'
import { Reference } from 'sanity'

export type CategoryInputContextValue = {
  onChange: (value: string) => void
  // FIXME: this might return something
  set: (nextValue: any) => any
  unset: () => void
  value: Reference[] | undefined
  schemaType: any
} | null

export const CategoryInputContext =
  createContext<CategoryInputContextValue>(null)

export const useCategoryInputContext = () => {
  const context = useContext(CategoryInputContext)
  if (!context) {
    throw new Error(
      'useCategoryInputContext must be used within a CategoryInputContextProvider'
    )
  }
  return context
}

export const CategoryInputContextProvider = CategoryInputContext.Provider
