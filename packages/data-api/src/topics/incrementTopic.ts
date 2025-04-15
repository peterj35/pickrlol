import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { queryItem } from '../lib/db'
import { parseLambdaProxyPayload, getPathParameter } from '../lib/lambda'
import {
  incrementChoicePlayedRound,
  incrementChoiceWonRound,
  incrementChoiceWonGame,
  incrementChoicePlayedGame,
} from '../lib/topic'
import { getTrackingParamsAndTrackEvent } from '../lib/tracking'
import { ITopic } from '../topics/topic'
import { logInvocation, getLambdaProxyResponse } from '../util'

const topicsTableName = process.env.TOPICS_TABLE_NAME

if (topicsTableName === undefined) {
  throw new Error('missing env vars')
}

export interface IIncrementTopicPayload {
  roundPlayedChoiceIds: string[]
  roundWonChoiceId: string
  /**
   * Whether the incremented choice won the game.
   * If this is passed in, it will increment the topic's
   * games completed count
   */
  gameWonChoiceId?: string
  gamePlayedChoiceIds?: string[]
}

interface IIncrementTopicResultBody {
  message: string
}

export const incrementTopic = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  logInvocation('incrementTopic', event, context)

  let statusCode = 200
  let message = ''

  const payload = parseLambdaProxyPayload<IIncrementTopicPayload>(event)

  if (!payload) {
    throw new Error('payload was invalid')
  }

  const topicId = getPathParameter(event, 'topicId', true)

  if (!topicId) {
    throw new Error('topicId was not found in the path')
  }

  let [topic] = await queryItem<ITopic>(topicsTableName, topicId)

  if (!topic) {
    statusCode = 404
    message = `Topic with ID ${topicId} was not found`
    return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
      message,
    })
  }

  const {
    roundPlayedChoiceIds,
    roundWonChoiceId,
    gameWonChoiceId,
    gamePlayedChoiceIds,
  } = payload

  if (roundPlayedChoiceIds.length !== 2) {
    statusCode = 422
    message = `Must pass in 2 roundPlayedChoiceIds. Received ${roundPlayedChoiceIds.length}`
    return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
      message,
    })
  }

  await getTrackingParamsAndTrackEvent('play_round', event, { topicId })

  for (const roundPlayedChoiceId of roundPlayedChoiceIds) {
    let updatedChoice = topic.choices[roundPlayedChoiceId]

    if (!updatedChoice) {
      statusCode = 422
      message = `A choice with ID ${roundPlayedChoiceId} was not found for topic ${JSON.stringify(
        topic
      )}`
      return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
        message,
      })
    }

    await incrementChoicePlayedRound(
      topicsTableName,
      topicId,
      roundPlayedChoiceId
    )

    if (roundPlayedChoiceId === roundWonChoiceId) {
      await incrementChoiceWonRound(
        topicsTableName,
        topicId,
        roundPlayedChoiceId
      )
    }
  }

  if (gameWonChoiceId) {
    if (!roundPlayedChoiceIds.includes(gameWonChoiceId)) {
      statusCode = 422
      message = `Cannot declare choice ID ${gameWonChoiceId} as winner when it wasn't played`
      return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
        message,
      })
    }

    const gameWonChoice = topic.choices[gameWonChoiceId]

    if (!gameWonChoice) {
      statusCode = 422
      message = `A choice with ID ${gameWonChoiceId} was not found.`
      return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
        message,
      })
    }

    await incrementChoiceWonGame(topicsTableName, topicId, gameWonChoiceId)

    await getTrackingParamsAndTrackEvent('finish_game', event, { topicId })
  }

  if (gamePlayedChoiceIds?.length) {
    for (const gamePlayedChoiceId of gamePlayedChoiceIds) {
      const gamePlayedChoice = topic.choices[gamePlayedChoiceId]

      if (!gamePlayedChoice) {
        statusCode = 422
        message = `A choice with ID ${gamePlayedChoice} was not found.`
        return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
          message,
        })
      }

      await incrementChoicePlayedGame(
        topicsTableName,
        topicId,
        gamePlayedChoiceId
      )
    }
  }

  message = `Increment successful`
  return getLambdaProxyResponse<IIncrementTopicResultBody>(statusCode, {
    message,
  })
}
