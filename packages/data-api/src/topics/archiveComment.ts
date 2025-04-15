import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import archiveTopicComment from '../comments/archiveTopicComment'
import { queryItem } from '../lib/db'
import { parseLambdaProxyPayload, ILambdaResultBody } from '../lib/lambda'
import { ITopic } from '../topics/topic'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopicComment } from './comment'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export interface IArchiveCommentPayload {
  topicId: ITopicComment['topicId']
  id: ITopicComment['id']
  // IMPROVE: unused atm but use to validate this user's permissions
  userId: ITopicComment['creatorId']
}

export const archiveComment = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('updateComment', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<IArchiveCommentPayload>(event)
  if (!payload || !payload.topicId || !payload.id || !payload.userId) {
    throw new Error('payload was invalid')
  }

  const { topicId, id } = payload

  const [topic] = await queryItem<ITopic>(topicsTableName, topicId)

  if (!topic || !topic.comments) {
    statusCode = 404
    message = `Topic with ID ${topicId} was not found, or the topic doesn't have any comments`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }

  const indexOfComment = topic.comments.findIndex(
    (comment) => comment.id === id
  )

  if (indexOfComment === -1) {
    statusCode = 404
    message = `Comment with ID ${id} for topic with Id ${topicId} was not found`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }

  const res = await archiveTopicComment({
    tableName: topicsTableName,
    topicId,
    commentId: id,
    indexOfComment,
  })

  message = `Topic with commentId ${id} for topicId ${topicId} successfully archived, with result ${JSON.stringify(
    res
  )}`

  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, { message })
}
