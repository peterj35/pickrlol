export type Tag = {
  // partition key, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html
  name: string
  // sort key
  usedCount: number

  createdAtTimestamp: number
  creatorId: string
  isArchived: boolean
  topicIds: string[]
}

export * from './getTags'
