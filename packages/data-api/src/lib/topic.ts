import { createOrIncrementTag } from './tags/createOrIncrementTag'
import { modifyTagUsedCount } from './tags/modifyTagUsedCount'
import { ITopic } from '../topics/topic'
import { IUpdateTopicPayload } from '../topics/updateTopic'
import { getAllItems, queryItem, updateItem } from './db'

export const getAllUnarchivedTopics = async (topicsTableName: string) => {
  const filterExpression = 'isArchived=:isArchived'
  const expressionAttributeValues = { ':isArchived': false }

  const topics = await getAllItems<ITopic>(
    topicsTableName,
    undefined,
    filterExpression,
    expressionAttributeValues
  )

  return topics
}

export const getUnarchivedTopic = async (
  topicsTableName: string,
  topicId: string
) => {
  const filterExpression = 'isArchived=:isArchived'
  const expressionAttributeValues = { ':isArchived': false }

  const topics = await queryItem<ITopic>(
    topicsTableName,
    topicId,
    filterExpression,
    expressionAttributeValues
  )

  return topics[0]
}

export const setTopicAsArchived = async (
  topicsTableName: string,
  topicId: string
) => {
  const key = { id: topicId }
  const updateExpression = 'SET isArchived = :isArchived'
  const expressionAttributeValues = { ':isArchived': true }

  const result = await updateItem({
    tableName: topicsTableName,
    key,
    updateExpression,
    expressionAttributeValues,
  })

  return result
}

/**
 * Updates the topic as well as any affected tags based on the edit.
 */
export const updateTopicWithPayload = async (
  topicsTableName: string,
  tagsTableName: string,
  topicId: string,
  topic: IUpdateTopicPayload
) => {
  // Update tag based on original tagNames too
  const [existingTopic] = await queryItem<ITopic>(topicsTableName, topicId)

  if (!existingTopic) {
    throw new Error(
      `Cannot update topic with ID ${topicId} because it was not found.`
    )
  }

  const nextTagNames = topic.tagNames || []

  const previousTagNames = existingTopic.tagNames || []

  const addedTagNames = nextTagNames.filter(
    (t) => !previousTagNames.includes(t)
  )
  const removedTagNames = previousTagNames.filter(
    (t) => !nextTagNames.includes(t)
  )

  for (const addedTag of addedTagNames) {
    await createOrIncrementTag({
      tableName: tagsTableName,
      tagName: addedTag,
      creatorId: existingTopic.creatorId,
      topicIds: [topicId],
    })
  }

  for (const removedTag of removedTagNames) {
    await modifyTagUsedCount(tagsTableName, 'remove', removedTag, [topicId])
  }

  const key = { id: topicId }
  const updateExpression =
    'SET #n = :name, description = :description, choiceIds = :choiceIds, choices = :choices, tagNames = :tagNames, rankScore = :rankScore'
  const expressionAttributeValues = {
    ':name': topic.name,
    ':description': topic.description,
    ':choiceIds': topic.choiceIds,
    ':choices': topic.choices,
    ':tagNames': nextTagNames,
    ':rankScore': topic.rankScore || 0,
  }
  const expressionAttributeNames = {
    '#n': 'name',
  }

  const result = await updateItem({
    tableName: topicsTableName,
    key,
    updateExpression,
    expressionAttributeValues,
    expressionAttributeNames,
  })

  return result
}

export const incrementChoicePlayedRound = async (
  tableName: string,
  topicId: string,
  choiceId: string
) => {
  const expressionAttributeNames = {
    '#choices': 'choices',
    '#choiceId': choiceId,
    '#rec': 'record',
    '#playedRoundCount': 'roundsPlayedCount',
  }

  const expressionAttributeValues = { ':inc': 1 }
  const updateExpression = 'ADD #choices.#choiceId.#rec.#playedRoundCount :inc'

  await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  })
}

export const incrementChoicePlayedGame = async (
  tableName: string,
  topicId: string,
  choiceId: string
) => {
  const expressionAttributeNames = {
    '#choices': 'choices',
    '#choiceId': choiceId,
    '#rec': 'record',
    '#playedGameCount': 'gamesPlayedCount',
  }

  const expressionAttributeValues = { ':inc': 1 }
  const updateExpression = 'ADD #choices.#choiceId.#rec.#playedGameCount :inc'

  await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  })
}

export const incrementChoiceWonRound = async (
  tableName: string,
  topicId: string,
  choiceId: string
) => {
  const expressionAttributeNames = {
    '#choices': 'choices',
    '#choiceId': choiceId,
    '#rec': 'record',
    '#wonCount': 'roundsWinCount',
  }
  const expressionAttributeValues = { ':inc': 1 }
  const updateExpression = 'ADD #choices.#choiceId.#rec.#wonCount :inc'

  await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  })
}

export const incrementChoiceWonGame = async (
  tableName: string,
  topicId: string,
  choiceId: string
) => {
  const expressionAttributeNames = {
    '#choices': 'choices',
    '#choiceId': choiceId,
    '#rec': 'record',
    '#wonCount': 'totalWinCount',
  }
  const expressionAttributeValues = { ':inc': 1 }
  const updateExpression = 'ADD #choices.#choiceId.#rec.#wonCount :inc'

  await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  })
}
