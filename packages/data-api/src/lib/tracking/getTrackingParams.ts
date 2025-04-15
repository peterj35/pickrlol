import { APIGatewayProxyEvent } from 'aws-lambda'
import { AmplitudeEventParams } from './track'

/**
 * A device Id is required as a minimum to track on Amplitude.
 *
 * An empty string is the default fallback, 'unknown' device id.
 */
const fallbackDeviceId = 'Unknown'

export type TrackMethodParams = Omit<AmplitudeEventParams, 'eventType'>

export const getTrackingParams = (
  event: APIGatewayProxyEvent
): TrackMethodParams => {
  const deviceId = event.queryStringParameters?.deviceId || fallbackDeviceId
  const userId = event.queryStringParameters?.userId
  const country = event.multiValueHeaders?.['CloudFront-Viewer-Country']?.[0]
  const isDesktop =
    event.multiValueHeaders?.['CloudFront-Is-Desktop-Viewer']?.[0]
  const isMobile = event.multiValueHeaders?.['CloudFront-Is-Mobile-Viewer']?.[0]
  const isTablet = event.multiValueHeaders?.['CloudFront-Is-Tablet-Viewer']?.[0]

  return {
    deviceId,
    userId,
    country,
    isDesktop,
    isMobile,
    isTablet,
  }
}
