import { useGetIsAdminUser } from '../../hooks/useGetIsAdminUser'
import { FeatureFlagId, featureFlags } from '../../data/featureFlags'
import { getIsDev } from '../env'

export const useGetIsFeatureEnabled = (featureId: FeatureFlagId): boolean => {
  const isDev = getIsDev()
  const isAdminUser = useGetIsAdminUser()

  const featureFlag = featureFlags[featureId]

  if (isDev) {
    if (isAdminUser) {
      return featureFlag.isDevEnabledAdmin
    }

    return featureFlag.isDevEnabled
  }

  if (isAdminUser) {
    return featureFlag.isProdEnabledAdmin
  }

  return featureFlag.isProdEnabled
}
