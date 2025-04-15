import { useState } from 'react'

type QueryParams = Record<string, string>

const getInitQueryParams = (): QueryParams =>
  Object.fromEntries(new URLSearchParams(window.location.search).entries())

/**
 * IMPROVE: support query updates from other places
 */
export const useQueryParams = (): [
  QueryParams,
  (nextParams: QueryParams) => void,
  (key: string, val: string) => void
] => {
  const [paramState, setParamState] = useState<QueryParams>(
    getInitQueryParams()
  )

  const setAllParams = (nextParams: QueryParams): void => {
    setParamState(nextParams)

    const params = new URLSearchParams()

    Object.keys(nextParams).forEach((paramKey) => {
      params.set(paramKey, nextParams[paramKey])
    })

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    )
  }

  const setSingleParam = (key: string, val: string): void => {
    const params = new URLSearchParams(window.location.search)

    params.set(key, val)

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    )
  }

  return [paramState, setAllParams, setSingleParam]
}
