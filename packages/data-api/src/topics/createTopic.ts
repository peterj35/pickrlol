import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { putItem } from '../lib/db'
import { parseLambdaProxyPayload } from '../lib/lambda'
import { createOrIncrementTag } from '../lib/tags/createOrIncrementTag'
import { ITopic } from '../topics/topic'
import { logInvocation, getLambdaProxyResponse } from '../util'

const topicsTableName = process.env.TOPICS_TABLE_NAME
const tagsTableName = process.env.TAGS_TABLE_NAME

if (topicsTableName === undefined || tagsTableName === undefined) {
  throw new Error('missing env vars')
}

interface ICreateTopicPayload {
  // IMPROVE @peterj35: ID should be generated server-side
  topic: ITopic
}

interface ICreateResultBody {
  message: string
}

export const createTopic = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('createTopic', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<ICreateTopicPayload>(event)

  if (!payload) {
    throw new Error('payload was invalid')
  }
  // IMPROVE: Add serverside validation

  const topic = payload.topic

  const topicTagNames = payload.topic.tagNames

  if (topicTagNames?.length) {
    for (const tag of topicTagNames) {
      await createOrIncrementTag({
        tableName: tagsTableName,
        tagName: tag,
        creatorId: topic.creatorId,
        topicIds: [topic.id],
      })
    }
  }

  const result = await putItem(topicsTableName, topic)

  message = `Topic with ID ${
    topic.id
  } creation successful, with result ${JSON.stringify(result)}`

  return getLambdaProxyResponse<ICreateResultBody>(statusCode, { message })
}
