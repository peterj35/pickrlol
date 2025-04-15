import { AWSError } from 'aws-sdk'
import {
  DocumentClient,
  ExpressionAttributeNameMap,
  ConditionExpression,
} from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

interface IUpdateItemProps {
  tableName: string
  key: DocumentClient.Key
  updateExpression: string
  expressionAttributeNames?: ExpressionAttributeNameMap
  expressionAttributeValues?: DocumentClient.ExpressionAttributeValueMap
  conditionExpression?: ConditionExpression
}

export const updateItem = async ({
  tableName,
  key,
  updateExpression,
  expressionAttributeNames,
  expressionAttributeValues,
  conditionExpression,
}: IUpdateItemProps): Promise<
  PromiseResult<DocumentClient.PutItemOutput, AWSError>
> =>
  await db
    .update({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: conditionExpression,
      ReturnValues: 'UPDATED_NEW',
    })
    .promise()
