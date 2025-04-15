import { Context, APIGatewayProxyResult } from 'aws-lambda'

export const logInvocation = (
  name: string,
  event: Object,
  context: Context
): void =>
  console.log(`${name} invoked with:
  
    event: ${JSON.stringify(event)}
    context: ${JSON.stringify(context)}
  `)

export const getLambdaProxyResponse = <T>(
  statusCode: number,
  body?: T
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  },
  body: body !== undefined ? JSON.stringify(body) : '',
})
