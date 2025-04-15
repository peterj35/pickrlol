import https from 'https'
import { convertCamelObjectToSnake } from '../lang'

const amplitudeAPIKey = process.env.AMPLITUDE_API_KEY

if (amplitudeAPIKey === undefined) {
  throw new Error('Cannot get amplitude API key from env')
}

export type EventType =
  | 'view_topics'
  | 'view_topic'
  | 'edit_topic'
  | 'finish_game'
  | 'play_round'

export type AmplitudeEventParams = {
  deviceId: string
  userId?: string
  country?: string
  isDesktop?: string
  isMobile?: string
  isTablet?: string
  eventType: EventType
}

export const track = async (
  events: AmplitudeEventParams[]
): Promise<string> => {
  const transformed = events.map((e) => convertCamelObjectToSnake(e))

  const payload = {
    api_key: amplitudeAPIKey,
    events: transformed,
  }

  console.log('Tracking events: ', transformed)

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.amplitude.com',
      path: '/2/httpapi',
      method: 'POST',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        resolve(body)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.write(JSON.stringify(payload))
    req.end()
  })
}
