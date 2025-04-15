import { useEffect, useMemo } from 'react'
import { getLongId } from '../lib/id'
import { DEVICE_ID_KEY } from '../lib/localStorage'
import useLocalStorage from './useLocalStorage'

export const useDeviceId = (): string => {
  const generatedId = useMemo(() => getLongId(), [])
  const [savedId, setSavedId] = useLocalStorage(DEVICE_ID_KEY, '')

  useEffect(() => {
    if (savedId === '') {
      setSavedId(generatedId)
    }
  }, [generatedId, savedId, setSavedId])

  return savedId
}
