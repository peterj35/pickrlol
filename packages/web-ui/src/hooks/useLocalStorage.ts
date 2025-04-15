import { useEffect, useState } from 'react'

/**
 * Persist the state with local storage so that it remains after a page refresh. This can be useful
 * for a dark theme or to record session information. This hook is used in the same way as useState
 * except that you must pass the storage key in the 1st parameter. If the window object is not
 * present (as in SSR), useLocalStorage() will return the default value.
 *
 * From https://usehooks-typescript.com/react-hook/use-local-storage
 *
 * @param key
 * @param initialValue
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep keep working, for SSR
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return initialValue
    }
  }
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue)
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window == 'undefined') {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      )
    }
    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(newValue))
      // Save state
      setStoredValue(newValue)
      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue())
    }
    // this only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange)
    // this is a custom event, triggered in writeValueToLocalStorage
    window.addEventListener('local-storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [storedValue, setValue]
}

export default useLocalStorage
