import styled from 'styled-components'
import useUploadProgress from '../hooks/useUploadProgress'
import FullScreenOverlay, { FullScreenOverlayProps } from './FullScreenOverlay'
import Loading from './Loading'

type TopicUploadingOverlayProps = {
  topicId: string
} & Omit<FullScreenOverlayProps, 'isVisible'>

/**
 * TopicUploadingOverlay
 *
 * Renders a blocking overlay while the given topic is being uploaded
 */
export const TopicUploadingOverlay: React.FC<TopicUploadingOverlayProps> = ({
  topicId,
  ...props
}) => {
  const [uploadProgress] = useUploadProgress()

  const isTopicUploading =
    uploadProgress.assetId === topicId &&
    uploadProgress.progress === 'uploading'

  return (
    <UploadingOverlay isVisible={isTopicUploading} hasTransition {...props}>
      <div>Your topic is being uploaded...</div>
      <Loading />
      <div>
        {uploadProgress.itemStatus
          ? `Uploading image ${uploadProgress.itemStatus.curr + 1} of ${
              uploadProgress.itemStatus.total
            }`
          : null}
      </div>
    </UploadingOverlay>
  )
}

const UploadingOverlay = styled(FullScreenOverlay)`
  background-color: rgba(0, 0, 0, 0.6);

  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`
