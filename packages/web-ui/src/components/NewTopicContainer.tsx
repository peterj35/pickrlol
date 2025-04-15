import NarrowView, { INarrowViewProps } from './NarrowView'
import React, { useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import Loading from './Loading'
import { postTopic } from '../lib/topic'
import EditTopic from './EditTopic'
import useUploadProgress from '../hooks/useUploadProgress'
import { ITopic } from '@ovo/data-api'
import useTopicNavigation from '../hooks/useTopicNavigation'
import { notifyAdminNewTopic } from '../lib/notifications'

interface INewTopicProps extends INarrowViewProps {}

const NewTopicContainer: React.FC<INewTopicProps> = () => {
  const { user, isLoading } = useAuth0()
  const userSub = user?.sub

  const [, setUploadProgress] = useUploadProgress()
  const navigateTopic = useTopicNavigation()

  const handleSubmit = useCallback(
    (topic: ITopic) => {
      const handlePost = async () => {
        setUploadProgress({
          progress: 'uploading',
          assetId: topic.id,
        })

        const handleImageUploadComplete = (
          currIndex: number,
          total: number
        ) => {
          setUploadProgress({
            progress: 'uploading',
            assetId: topic.id,
            itemStatus: {
              curr: currIndex,
              total,
            },
          })
        }

        await postTopic({
          topic,
          onImageUploadComplete: handleImageUploadComplete,
        })

        setUploadProgress({
          progress: 'completed',
        })
      }

      handlePost()
      navigateTopic(topic.id, topic.name, topic)

      notifyAdminNewTopic(topic.name, topic.description, topic.creatorId)
    },
    [navigateTopic, setUploadProgress]
  )

  /**
   * Render
   */

  if (isLoading) {
    return (
      <NarrowView centering>
        <Loading />
      </NarrowView>
    )
  }

  if (!userSub) {
    return (
      <NarrowView>
        <h3>🌊 Please signup or login</h3>
        <p>Logging in will:</p>
        <ol>
          <li>Allow creating new topics for anyone in the world to play</li>
          <li>Allow editing your topics to add new choices</li>
        </ol>
        <p>
          Pickr does not collect or store any personal data. You can use your
          Google account to login.
        </p>
        <LoginButton>Let's login</LoginButton>
      </NarrowView>
    )
  }

  return (
    <NarrowView centering>
      <h1>New Topic</h1>
      <EditTopic userId={userSub} onSubmit={handleSubmit} canEditChoiceimages />
    </NarrowView>
  )
}

export default NewTopicContainer
