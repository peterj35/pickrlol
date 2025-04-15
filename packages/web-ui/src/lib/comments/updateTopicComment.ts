import { IUpdateCommentPayload } from '@ovo/data-api'
import axios from 'axios'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

export const updateTopicComment = async ({
  topicId,
  id,
  creatorName,
  body,
}: IUpdateCommentPayload) =>
  await axios.put(`${API_ENDPOINT_TOPICS}/${topicId}/comment`, {
    topicId,
    id,
    creatorName,
    body,
  })
