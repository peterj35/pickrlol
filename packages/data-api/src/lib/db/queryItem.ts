import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const queryItem = async <T>(
  tableName: string,
  id: string,
  filterExpression?: string,
  expressionAttributeValues?: Object
): Promise<T[]> => {
  const result = await db
    .query({
      TableName: tableName,
      KeyConditionExpression: 'id = :id',
      FilterExpression: filterExpression,
      ExpressionAttributeValues: {
        ':id': id,
        ...expressionAttributeValues,
      },
    })
    .promise()

  if (result.Items === undefined) {
    return []
  }

  return result.Items as T[]
}
