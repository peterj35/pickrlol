import { IIncrementTopicCommentUpvotePayload } from '@ovo/data-api'
import axios from 'axios'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

export const modifyTopicCommentUpvote = async ({
  topicId,
  commentId,
  modifier,
}: IIncrementTopicCommentUpvotePayload) =>
  await axios.post(`${API_ENDPOINT_TOPICS}/${topicId}/comment/upvote`, {
    topicId,
    commentId,
    modifier,
  })
