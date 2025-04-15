import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { Tag } from '../../tags'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const createTag = async (
  tagsTableName: string,
  tag: Tag
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> =>
  await db
    .put({
      TableName: tagsTableName,
      Item: tag,
    })
    .promise()
