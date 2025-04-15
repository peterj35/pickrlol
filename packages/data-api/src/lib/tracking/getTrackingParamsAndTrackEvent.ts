import { APIGatewayProxyEvent } from 'aws-lambda'
import { getTrackingParams } from './getTrackingParams'
import { EventType, track } from './track'

export const getTrackingParamsAndTrackEvent = async (
  eventType: EventType,
  event: APIGatewayProxyEvent,
  otherParams?: Record<string, string>
) => {
  const trackingParams = getTrackingParams(event)

  return await track([
    {
      ...trackingParams,
      ...otherParams,
      eventType,
    },
  ])
}
