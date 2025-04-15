type FeatureFlag = {
  id: FeatureFlagId
  name: string
  isProdEnabled: boolean
  isProdEnabledAdmin: boolean
  isDevEnabledAdmin: boolean
  isDevEnabled: boolean
}

export type FeatureFlagId = 'createTags' | 'viewTags'

export const featureFlags: Record<FeatureFlagId, FeatureFlag> = {
  createTags: {
    id: 'createTags',
    name: 'Enable tag creation',
    isProdEnabled: false,
    isProdEnabledAdmin: true,
    isDevEnabledAdmin: true,
    isDevEnabled: false,
  },
  viewTags: {
    id: 'viewTags',
    name: 'Enable tag viewing',
    isProdEnabled: true,
    isProdEnabledAdmin: true,
    isDevEnabledAdmin: true,
    isDevEnabled: true,
  },
}
