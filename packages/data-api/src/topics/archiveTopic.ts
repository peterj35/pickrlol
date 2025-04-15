import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { getPathParameter, ILambdaResultBody } from '../lib/lambda'
import { setTopicAsArchived } from '../lib/topic'
import { logInvocation, getLambdaProxyResponse } from '../util'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export const archiveTopic = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('archiveTopic', event, context)

  let statusCode = 200
  let message = ''

  const topicId = getPathParameter(event, 'topicId', true)

  if (!topicId) {
    throw new Error('topicId was not found in the path')
  }

  const result = await setTopicAsArchived(topicsTableName, topicId)

  message = `Topic with ID ${topicId} was archived successfully, with result ${JSON.stringify(
    result
  )}`

  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, { message })
}
