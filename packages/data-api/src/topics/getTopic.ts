import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { getPathParameter } from '../lib/lambda'
import { getUnarchivedTopic } from '../lib/topic'
import { getTrackingParamsAndTrackEvent } from '../lib/tracking'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopic } from './topic'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export const getTopic = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('getTopic', event, context)

  let statusCode = 200

  const topicId = getPathParameter(event, 'topicId', true)

  if (!topicId) {
    throw new Error('topicId was not found in the path')
  }

  await getTrackingParamsAndTrackEvent('view_topic', event, { topicId })

  const topic = await getUnarchivedTopic(topicsTableName, topicId)

  // Make assumption that the first item from the query is the topic we want
  return getLambdaProxyResponse<ITopic>(statusCode, topic)
}
