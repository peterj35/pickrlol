import { TAG_NAME_SELECTIONS_KEY } from '../lib/localStorage'
import useLocalStorage from './useLocalStorage'

export const useStoredTagNameSelections = (): [
  string[],
  (value: string[]) => void
] => {
  const [storedTagNames, setStoredTagNames] = useLocalStorage<string[]>(
    TAG_NAME_SELECTIONS_KEY,
    []
  )

  return [storedTagNames, setStoredTagNames]
}
