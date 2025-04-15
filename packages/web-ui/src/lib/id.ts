import { v4 as uuid } from 'uuid'
import cryptoRandomString from 'crypto-random-string'

/**
 * @returns a v4 uuid
 */
export const getLongId = () => uuid()

/**
 * @returns a short ID that doesn't guarantee the strongest uniqueness
 */
export const getShortId = () =>
  cryptoRandomString({ length: 5, type: 'alphanumeric' })
