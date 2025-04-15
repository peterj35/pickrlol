import { ITopic } from '@ovo/data-api'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetIsAdminUser } from '../hooks/useGetIsAdminUser'
import useTopicNavigation from '../hooks/useTopicNavigation'
import { useUserIdentifiers } from '../hooks/useUserIdentifiers'
import { fetchTopic, updateTopic } from '../lib/topic'
import EditTopic from './EditTopic'
import Loading from './Loading'
import NarrowView from './NarrowView'

interface IEditTopicPageParams {
  topicId: string
}

const EditTopicContainer: React.FC<{}> = () => {
  const isAdminUser = useGetIsAdminUser()
  const { topicId } = useParams<IEditTopicPageParams>()

  const [topic, setTopic] = useState<ITopic | undefined>(undefined)

  const navigateTopic = useTopicNavigation()

  const { deviceId, userId, isLoading } = useUserIdentifiers()

  useEffect(() => {
    const getAndSetTopicFromRemote = async () => {
      const topicFromRemote = await fetchTopic(topicId, { deviceId, userId })
      setTopic(topicFromRemote)
    }

    if (!isLoading) {
      getAndSetTopicFromRemote()
    }
  }, [deviceId, isLoading, topicId, userId])

  const handleSubmit = useCallback(
    async (topic: ITopic) => {
      const putTopic = async () => {
        await updateTopic(topicId, topic, { deviceId, userId })
      }

      await putTopic()

      navigateTopic(topic.id, topic.name, topic)
    },
    [deviceId, navigateTopic, topicId, userId]
  )

  if (!topic || isLoading || !userId) {
    return (
      <NarrowView centering>
        <Loading />
      </NarrowView>
    )
  }

  if (topic.creatorId !== userId && !isAdminUser) {
    throw new Error('You do not have access.')
  }

  return (
    <NarrowView centering>
      <h1>{topic.name}</h1>
      <EditTopic
        topic={topic}
        userId={userId}
        canEditChoiceimages={false}
        onSubmit={handleSubmit}
      />
    </NarrowView>
  )
}

export default EditTopicContainer
