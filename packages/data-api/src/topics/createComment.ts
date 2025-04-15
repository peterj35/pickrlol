import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import addTopicComment from '../comments/addTopicComment'
import { parseLambdaProxyPayload, ILambdaResultBody } from '../lib/lambda'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopicComment } from './comment'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export interface ICreateTopicCommentPayload {
  id: ITopicComment['id']
  topicId: ITopicComment['topicId']
  creatorId: ITopicComment['creatorId']
  creatorName: ITopicComment['creatorName']
  body: ITopicComment['body']
  wonChoiceId: ITopicComment['wonChoiceId']
  wonChoiceName: ITopicComment['wonChoiceName']
}

interface ICreateCommentPayload {
  topicComment: ICreateTopicCommentPayload
}

export const createComment = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('createComment', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<ICreateCommentPayload>(event)

  if (!payload) {
    throw new Error('payload was invalid')
  }
  // IMPROVE: Add serverside validation

  const topicId = payload.topicComment.topicId
  const comment = payload.topicComment

  const res = await addTopicComment(topicsTableName, topicId, comment)

  message = `Topic with commentId ${
    payload.topicComment.id
  } for topicId ${topicId} successful, with result ${JSON.stringify(res)}`

  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, { message })
}
