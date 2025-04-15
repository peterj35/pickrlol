import axios from 'axios'
import { getIsDev } from '../env'

const adminNotificationUrl = process.env.REACT_APP_ADMIN_NOTIFICATION_URL

if (typeof adminNotificationUrl !== 'string') {
  throw new Error('env var REACT_APP_ADMIN_NOTIFICATION_URL not defined')
}

export const notifyAdminNewTopic = async (
  name: string,
  description: string,
  userId: string
) => {
  let message = `A new topic, "${name}", with description "${description}" has just been created by user of ID "${userId}"`

  if (getIsDev()) {
    message = `Dev/Test: ${message} `
  }

  await axios.post(`${adminNotificationUrl}`, message)
}
