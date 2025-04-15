import { Dispatch, SetStateAction } from 'react'
import { useContext } from 'react'
import {
  IUploadProgressState,
  UploadProgressContext,
} from '../context/uploadProgress'

const useUploadProgress: () => [
  IUploadProgressState,
  Dispatch<SetStateAction<IUploadProgressState>>
] = () => {
  const context = useContext(UploadProgressContext)
  if (!context) {
    throw new Error(
      'useUploadProgress must be used within the UploadProgressProvider'
    )
  }
  const [uploadProgress, setUploadProgress] = context

  return [uploadProgress, setUploadProgress] as [
    IUploadProgressState,
    Dispatch<SetStateAction<IUploadProgressState>>
  ]
}

export default useUploadProgress
