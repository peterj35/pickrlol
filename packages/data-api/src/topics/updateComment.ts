import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import updateTopicComment from '../comments/updateTopicComment'
import { queryItem } from '../lib/db'
import { parseLambdaProxyPayload, ILambdaResultBody } from '../lib/lambda'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopicComment } from './comment'
import { ITopic } from '../topics/topic'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export interface IUpdateCommentPayload {
  topicId: ITopicComment['topicId']
  id: ITopicComment['id']
  creatorName: ITopicComment['creatorName']
  body: ITopicComment['body']
}

export const updateComment = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('updateComment', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<IUpdateCommentPayload>(event)
  if (
    !payload ||
    !payload.topicId ||
    !payload.id ||
    !payload.creatorName ||
    !payload.body
  ) {
    throw new Error('payload was invalid')
  }

  const { topicId, id, creatorName, body } = payload

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

  const res = await updateTopicComment({
    tableName: topicsTableName,
    topicId,
    commentId: id,
    indexOfComment,
    creatorName,
    body,
  })

  message = `Topic with commentId ${id} for topicId ${topicId} successful, with result ${JSON.stringify(
    res
  )}`

  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, { message })
}
