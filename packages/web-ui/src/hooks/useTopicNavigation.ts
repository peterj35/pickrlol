import { ITopic } from '@ovo/data-api'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import slugify from 'slugify'

const useTopicNavigation = () => {
  const history = useHistory()

  const navigate = useCallback(
    (topicId: string, topicName?: string, topic?: ITopic) => {
      history.push(`/${topicId}${topicName ? `/${slugify(topicName)}` : ''}`, {
        topic: topic,
      })
    },
    [history]
  )

  return navigate
}

export default useTopicNavigation
