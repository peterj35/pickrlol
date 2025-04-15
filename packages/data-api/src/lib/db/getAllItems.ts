import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const getAllItems = async <T>(
  tableName: string,
  lastEvaluatedKey?: DocumentClient.Key,
  filterExpression?: string,
  expressionAttributeValues?: Object
): Promise<T[]> => {
  const results = await db
    .scan({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })
    .promise()
  let items = results.Items as T[]

  if (results.LastEvaluatedKey) {
    const nextItems = await getAllItems<T>(
      tableName,
      results.LastEvaluatedKey,
      filterExpression,
      expressionAttributeValues
    )
    items = [...items, ...nextItems]
  }

  return items
}
