import { createContext, useContext } from 'react'
import { Reference } from 'sanity'

export type TaxonomyContext = {
  onChange: (value: string) => void
  // FIXME: this might return something
  set: (nextValue: any) => any
  unset: () => void
  value: Reference[] | undefined
  schemaType: any
} | null

export const TaxonomyContext = createContext<TaxonomyContext>(null)

export const useTaxonomy = () => {
  const context = useContext(TaxonomyContext)
  if (!context) {
    throw new Error('useTaxonomy must be used within a TaxonomyContextProvider')
  }
  return context
}

export const TaxonomyContextProvider = TaxonomyContext.Provider
