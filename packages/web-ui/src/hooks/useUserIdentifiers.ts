import { useAuth0 } from '@auth0/auth0-react'
import { useDeviceId } from './useDeviceId'

type UseUserIdentifiersPayload = {
  userId?: string
  isLoading: boolean
  deviceId: string
}

export const useUserIdentifiers = (): UseUserIdentifiersPayload => {
  const { user, isLoading } = useAuth0()
  const deviceId = useDeviceId()

  return {
    userId: isLoading ? undefined : user?.sub,
    isLoading,
    deviceId,
  }
}
