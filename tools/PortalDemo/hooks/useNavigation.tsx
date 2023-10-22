import { BASE_URL } from 'lib/constants'
import { createContext, useContext } from 'react'
import { useDataset } from 'sanity'
import { PORTAL_BASE_PATH } from '../PortalDemo'

// create the context
export const NavigationContext = createContext({
  urlPrefix: '',
})

// create the provider
export const NavigationProvider = ({ children }) => {
  const dataset = useDataset()

  const urlPrefix = `${BASE_URL}/studio/${dataset}${PORTAL_BASE_PATH}`

  const value = {
    urlPrefix,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

// create the consumer
export const NavigationConsumer = NavigationContext.Consumer

// create the hook
export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
