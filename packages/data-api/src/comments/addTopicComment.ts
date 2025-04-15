import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { ICreateTopicCommentPayload, ITopicComment } from '../topics'
import { updateItem } from '../lib/db'

const initCommentDefaults = (
  createPayload: ICreateTopicCommentPayload
): ITopicComment => ({
  upvotes: 0,
  isArchived: false,
  createdAtTimestamp: Date.now(),
  ...createPayload,
})

const addTopicComment = async (
  tableName: string,
  topicId: string,
  commentPayload: ICreateTopicCommentPayload
): Promise<{
  topicComment: ITopicComment
  res: PromiseResult<DocumentClient.PutItemOutput, AWSError>
}> => {
  const fullCommentPayload = initCommentDefaults(commentPayload)

  const expressionAttributeNames = {
    '#comments': 'comments',
  }
  const expressionAttributeValues = {
    ':topicComment': [fullCommentPayload],
    ':emptyList': [],
  }
  const updateExpression =
    'SET #comments = list_append(:topicComment, if_not_exists(#comments, :emptyList))'

  // IMPROVE: validate the topic exists before adding a comment for it
  const res = await updateItem({
    tableName,
    key: { id: topicId },
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  })

  return { topicComment: fullCommentPayload, res }
}

export default addTopicComment
