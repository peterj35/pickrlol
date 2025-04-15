import { updateItem } from '../lib/db'

const modifyCommentUpvote = async (
  tableName: string,
  topicId: string,
  indexOfComment: number,
  commentId: string,
  value: 1 | -1
) => {
  const expressionAttributeNames = {
    '#comments': 'comments',
    '#upvotes': 'upvotes',
    '#id': 'id',
  }
  const expressionAttributeValues = { ':inc': value, ':commentId': commentId }
  const updateExpression = `ADD #comments[${indexOfComment}].#upvotes :inc`
  const conditionExpression = `#comments[${indexOfComment}].#id = :commentId`

  return await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
    conditionExpression,
  })
}

export default modifyCommentUpvote
