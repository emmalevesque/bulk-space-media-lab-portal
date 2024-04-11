'use client'
import { useEffect, useReducer, useRef } from 'react'

// Initialize Sanity client (replace with your project's details)
import { _readClient as client } from 'lib/sanity.client'

interface State<T> {
  data?: T
  error?: Error
}

type Cache<T> = { [query: string]: T }

// discriminated union type
type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error }

export function useFetch<T = unknown>(query?: string, params?: any): State<T> {
  const cache = useRef<Cache<T>>({})

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false)

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  }

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState }
      case 'fetched':
        return { ...initialState, data: action.payload }
      case 'error':
        return { ...initialState, error: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(fetchReducer, initialState)

  useEffect(() => {
    // Do nothing if the query is not given
    if (!query) return

    cancelRequest.current = false

    const fetchData = async () => {
      dispatch({ type: 'loading' })

      // capture the query state
      const queryString = JSON.stringify([query, params])

      // If a cache exists for this query, return it
      if (cache.current[queryString]) {
        dispatch({ type: 'fetched', payload: cache.current[queryString] })
        return
      }

      try {
        const data = await client.fetch<T>(query, params)
        cache.current[queryString] = data
        if (cancelRequest.current) return

        dispatch({ type: 'fetched', payload: data })
      } catch (error) {
        if (cancelRequest.current) return

        dispatch({ type: 'error', payload: error as Error })
      }
    }

    void fetchData()

    // Cleanup function
    return () => {
      cancelRequest.current = true
    }
  }, [query, params])

  return state
}
