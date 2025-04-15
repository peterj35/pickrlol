import { AWSError } from 'aws-sdk'
import { DocumentClient, ConditionExpression } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

interface IDeleteItemProps {
  tableName: string
  key: DocumentClient.Key
  conditionExpression?: ConditionExpression
}

/**
 * @returns The content of the old item that was deleted
 */
export const deleteItem = async ({
  tableName,
  key,
  conditionExpression,
}: IDeleteItemProps): Promise<
  PromiseResult<DocumentClient.DeleteItemOutput, AWSError>
> =>
  await db
    .delete({
      TableName: tableName,
      Key: key,
      ConditionExpression: conditionExpression,
      ReturnValues: 'ALL_OLD',
    })
    .promise()
