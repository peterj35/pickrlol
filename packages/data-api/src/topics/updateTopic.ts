import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import {
  getPathParameter,
  parseLambdaProxyPayload,
  ILambdaResultBody,
} from '../lib/lambda'
import { updateTopicWithPayload } from '../lib/topic'
import { getTrackingParamsAndTrackEvent } from '../lib/tracking'
import { ITopic } from '../topics/topic'
import { logInvocation, getLambdaProxyResponse } from '../util'

const topicsTableName = process.env.TOPICS_TABLE_NAME
const tagsTableName = process.env.TAGS_TABLE_NAME

if (topicsTableName === undefined || tagsTableName === undefined) {
  throw new Error('missing env vars')
}

export interface IUpdateTopicPayload {
  name: ITopic['name']
  description: ITopic['description']
  choiceIds: ITopic['choiceIds']
  choices: ITopic['choices']
  tagNames?: ITopic['tagNames']
  rankScore?: ITopic['rankScore']
}

export const updateTopic = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('updateTopic', event, context)

  let statusCode = 200
  let message = ''

  const topicId = getPathParameter(event, 'topicId', true)

  if (!topicId) {
    throw new Error('topicId was not found in the path')
  }

  const payload = parseLambdaProxyPayload<IUpdateTopicPayload>(event)

  if (!payload) {
    throw new Error('payload was invalid')
  }

  const result = await updateTopicWithPayload(
    topicsTableName,
    tagsTableName,
    topicId,
    payload
  )

  message = `Topic with ID ${topicId} was updated successfully, with result ${JSON.stringify(
    result
  )}`

  await getTrackingParamsAndTrackEvent('edit_topic', event, { topicId })

  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, { message })
}
