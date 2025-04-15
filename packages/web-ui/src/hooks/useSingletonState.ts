import { useCallback, useEffect, useState } from 'react'

const singletonState: Record<string, unknown> = {}

const useSingletonState = <T>(key: string, initValue: T) => {
  const [state, setState] = useState<unknown>(initValue)

  useEffect(() => {
    const val = singletonState[key]
    if (typeof val !== undefined) {
      setState(val)
    }
  }, [key])

  const setSingletonState = useCallback(
    (nextVal: T) => {
      singletonState[key] = nextVal
      setState(nextVal)
    },
    [key]
  )

  return [state, setSingletonState]
}

export default useSingletonState
