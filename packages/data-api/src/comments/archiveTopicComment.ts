import { updateItem } from '../lib/db'

interface IArchiveTopicCommentProps {
  tableName: string
  topicId: string
  indexOfComment: number
  commentId: string
}

const archiveTopicComment = async ({
  tableName,
  topicId,
  indexOfComment,
  commentId,
}: IArchiveTopicCommentProps) => {
  const expressionAttributeNames = {
    '#comments': 'comments',
    '#isArchived': 'isArchived',
    '#id': 'id',
  }
  const expressionAttributeValues = {
    ':commentId': commentId,
    ':isTrue': true,
  }
  const updateExpression = `SET #comments[${indexOfComment}].#isArchived = :isTrue`
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

export default archiveTopicComment
