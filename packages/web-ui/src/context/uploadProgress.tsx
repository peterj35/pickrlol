import { useState, createContext, Dispatch, SetStateAction } from 'react'

type UploadProgress = 'idle' | 'uploading' | 'completed'

type ItemStatus = {
  curr: number
  total: number
}

export interface IUploadProgressState {
  progress: UploadProgress
  assetId?: string
  itemStatus?: ItemStatus
}

const defaultContext: IUploadProgressState = { progress: 'idle' }

export const UploadProgressContext = createContext<
  | [IUploadProgressState, Dispatch<SetStateAction<IUploadProgressState>>]
  | undefined
>(undefined)

export const UploadProgressContextProvider = ({ ...props }) => {
  const [uploadProgress, setUploadProgress] = useState<IUploadProgressState>(
    defaultContext
  )

  const value = [uploadProgress, setUploadProgress] as [
    IUploadProgressState,
    Dispatch<SetStateAction<IUploadProgressState>>
  ]

  return <UploadProgressContext.Provider value={value} {...props} />
}
