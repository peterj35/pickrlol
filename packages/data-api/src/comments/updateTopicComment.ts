import { updateItem } from '../lib/db'

interface IUpdateTopicCommentProps {
  tableName: string
  topicId: string
  indexOfComment: number
  commentId: string
  body: string
  creatorName: string
}

const updateTopicComment = async ({
  tableName,
  topicId,
  indexOfComment,
  commentId,
  body,
  creatorName,
}: IUpdateTopicCommentProps) => {
  const expressionAttributeNames = {
    '#comments': 'comments',
    '#body': 'body',
    '#creatorName': 'creatorName',
    '#id': 'id',
    '#editedAt': 'editedAtTimestamp',
  }
  const expressionAttributeValues = {
    ':newBody': body,
    ':newCreatorName': creatorName,
    ':commentId': commentId,
    ':editedAtTimestamp': Date.now(),
  }
  const updateExpression = `SET #comments[${indexOfComment}].#body = :newBody, #comments[${indexOfComment}].#creatorName = :newCreatorName, #comments[${indexOfComment}].#editedAt = :editedAtTimestamp`
  const conditionExpression = `#comments[${indexOfComment}].#id = :commentId`

  return await updateItem({
    tableName,
    key: { id: topicId },
    updateExpression,
    expressionAttributeValues,
    expressionAttributeNames,
    conditionExpression,
  })
}

export default updateTopicComment
