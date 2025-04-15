import { APIGatewayProxyEvent } from 'aws-lambda'

export const parseLambdaProxyPayload = <T>(event: APIGatewayProxyEvent): T => {
  if (typeof event.body !== 'string') {
    throw new Error('event body is not a string')
  }

  const payload = JSON.parse(event.body) as T

  return payload
}

export const getPathParameter = (
  event: APIGatewayProxyEvent,
  key: string,
  isOptional = false
): string | undefined => {
  const params = event.pathParameters

  if (!params || typeof params !== 'object') {
    throw new Error('path parameters undefined')
  }

  const val = params[key]

  if (!isOptional && typeof val !== 'string') {
    throw new Error(`${key} path parameter undefined`)
  }

  return val
}

export interface ILambdaResultBody {
  message: string
}
