import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const putItem = async <
  T extends DocumentClient.PutItemInputAttributeMap
>(
  tableName: string,
  item: T
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> =>
  await db
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise()
