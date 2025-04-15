import { useAuth0 } from '@auth0/auth0-react'
import { ITopic } from '@ovo/data-api'

export const useMatchesCurrentUserId = (
  creatorId: ITopic['creatorId']
): boolean => {
  const { user } = useAuth0()

  return user && user.sub === creatorId
}
