import { useBeforeunload } from 'react-beforeunload'
import useUploadProgress from './useUploadProgress'

/**
 * Hook which contains logic to prevent the window from
 * being unloaded (ie. closed) if background operations are taking place
 */
const usePreventUnload = () => {
  const [uploadProgress] = useUploadProgress()

  useBeforeunload((event) => {
    if (uploadProgress.progress === 'uploading') {
      event.preventDefault()
    }
  })
}

export default usePreventUnload
