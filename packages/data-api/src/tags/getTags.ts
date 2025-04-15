import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { getAllUnarchivedTags } from '../lib/tags/getAllUnarchivedTags'
import { Tag } from '.'

const tagsTableName = process.env.TAGS_TABLE_NAME

if (tagsTableName === undefined) {
  throw new Error('missing env vars')
}

/**
 * @returns tags, sorted by usedCount in descending order
 */
export const getTags = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('getTags', event, context)

  let statusCode = 200

  const tags = await getAllUnarchivedTags(tagsTableName)

  const tagsSortedByUsedCount = tags.sort((a, b) => b.usedCount - a.usedCount)

  return getLambdaProxyResponse<Tag[]>(statusCode, tagsSortedByUsedCount)
}
