import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const queryTag = async <T>(
  tableName: string,
  tagName: string,
  filterExpression?: string,
  expressionAttributeValues?: Object
): Promise<T[]> => {
  const result = await db
    .query({
      TableName: tableName,
      KeyConditionExpression: '#N = :name',
      FilterExpression: filterExpression,
      ExpressionAttributeValues: {
        ':name': tagName,
        ...expressionAttributeValues,
      },
      ExpressionAttributeNames: {
        '#N': 'name',
      },
    })
    .promise()

  if (result.Items === undefined) {
    return []
  }

  return result.Items as T[]
}
