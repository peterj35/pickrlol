import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import modifyCommentUpvote from '../comments/modifyCommentUpvote'
import { queryItem } from '../lib/db'
import { parseLambdaProxyPayload, ILambdaResultBody } from '../lib/lambda'
import { logInvocation, getLambdaProxyResponse } from '../util'
import { ITopic } from '../topics/topic'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

/**
 * Expected payload to increment the upvote counter for a topic
 * In the future, pass in a userId as well and run jobs to validate
 * the uniqueness of the upvote.
 */
export interface IIncrementTopicCommentUpvotePayload {
  topicId: string
  commentId: string
  modifier: 1 | -1
}

export const modifyTopicCommentUpvote = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('incrementTopicCommentUpvote', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<IIncrementTopicCommentUpvotePayload>(
    event
  )

  if (!payload) {
    throw new Error('payload was invalid')
  }

  const { topicId, commentId, modifier } = payload

  const [topic] = await queryItem<ITopic>(topicsTableName, topicId)

  if (!topic || !topic.comments) {
    statusCode = 404
    message = `Topic with ID ${topicId} was not found, or the topic doesn't have any comments`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }

  const indexOfComment = topic.comments.findIndex(
    (comment) => comment.id === commentId
  )

  if (indexOfComment === -1) {
    statusCode = 404
    message = `Comment with ID ${commentId} for topic with Id ${topicId} was not found`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }
  if (modifier !== 1 && modifier !== -1) {
    statusCode = 400
    message = `Invalid modifier value: ${modifier}, was provided`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }

  try {
    await modifyCommentUpvote(
      topicsTableName,
      topicId,
      indexOfComment,
      commentId,
      modifier
    )
  } catch (e: any) {
    if (e?.code === 'ConditionalCheckFailedException') {
      statusCode = 409
      message = `Was unable to upvote, the resource likely changed. Please try again in a moment`
      return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
        message,
      })
    }

    statusCode = 500
    message = `Unknown error occurred`
    return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
      message,
    })
  }

  message = `Increment upvote for topic ${topicId}'s comment ${commentId} successful`
  return getLambdaProxyResponse<ILambdaResultBody>(statusCode, {
    message,
  })
}
