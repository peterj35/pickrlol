import { IArchiveCommentPayload } from '@ovo/data-api'
import axios from 'axios'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

export const archiveTopicComment = async ({
  topicId,
  id,
  userId,
}: IArchiveCommentPayload) =>
  await axios.put(`${API_ENDPOINT_TOPICS}/${topicId}/comment/archive`, {
    topicId,
    id,
    userId,
  })
