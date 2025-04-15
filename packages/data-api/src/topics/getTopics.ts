import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { getAllUnarchivedTopics } from '../lib/topic'
import { getTrackingParamsAndTrackEvent } from '../lib/tracking'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopic } from '../topics/topic'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

/**
 * @returns topics, sorted by createdAtTimestamp in descending order
 */
export const getTopics = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('getTopics', event, context)

  await getTrackingParamsAndTrackEvent('view_topics', event)

  const tags = event.multiValueQueryStringParameters?.tags

  let statusCode = 200

  let topics = await getAllUnarchivedTopics(topicsTableName)

  if (tags) {
    topics = topics.filter((t) =>
      t.tagNames?.some((topicTag) => tags.includes(topicTag))
    )
  }

  const topicsSortedByCreatedAt = topics.sort(
    (a, b) => b.createdAtTimestamp - a.createdAtTimestamp
  )

  return getLambdaProxyResponse<ITopic[]>(statusCode, topicsSortedByCreatedAt)
}
