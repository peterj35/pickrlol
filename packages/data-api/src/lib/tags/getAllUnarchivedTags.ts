import { Tag } from '../../tags'
import { getAllItems } from '../db'

export const getAllUnarchivedTags = async (tagsTableName: string) => {
  const filterExpression = 'isArchived=:isArchived'
  const expressionAttributeValues = { ':isArchived': false }

  const tags = await getAllItems<Tag>(
    tagsTableName,
    undefined,
    filterExpression,
    expressionAttributeValues
  )

  return tags
}
