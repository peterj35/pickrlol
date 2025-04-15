import { ICreateTopicCommentPayload } from '@ovo/data-api'
import axios from 'axios'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

export const createTopicComment = async (
  topicComment: ICreateTopicCommentPayload
) =>
  await axios.post(`${API_ENDPOINT_TOPICS}/${topicComment.topicId}/comment`, {
    topicComment,
  })
