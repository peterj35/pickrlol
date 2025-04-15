import { ITopic, ITopicSummary } from '@ovo/data-api'
import { getTopChoices, getTotalPlayedCount } from './topic'

export const topicSummarySortOrder = [
  'featured',
  'newlyCreated',
  'mostPlayed',
] as const

export type TopicSummarySortOrder = typeof topicSummarySortOrder[number]

export const rankScoreHarshEffectThreshold = -50

export const orderToLabel: Record<TopicSummarySortOrder, string> = {
  newlyCreated: 'New',
  mostPlayed: 'Most Played',
  featured: 'Featured',
}

export const getTopicSummaries = (
  topics: ITopic[],
  order: TopicSummarySortOrder
): ITopicSummary[] => {
  /**
   * Sort in the frontend so that no network request
   * is needed for sort order updates
   *
   * In the future, the sort should be done serverside
   * so that initial request can return the topics in
   * correct order.
   * Consider caching results in order to not re-fetch.
   * Consider paginated results when number of topics
   * becomes very large.
   */
  const sortOrder = getSortOrder(order)

  return topics
    .map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      createdAtTimestamp: topic.createdAtTimestamp,
      creatorId: topic.creatorId,
      topChoiceMediaSrcs: getTopChoices(topic.choices)
        .sort((a, b) => b.record.totalWinCount - a.record.totalWinCount)
        .map((choice) => choice.thumbMediaSrc || choice.mediaSrc),
      choicesChosenCount: topic.choiceIds.length,
      totalChoiceCount: topic.choiceIds.length,
      totalGamesPlayedCount: getTotalPlayedCount(topic),
      tagNames: topic.tagNames || [],
      rankScore: topic.rankScore || 0,
    }))
    .sort(sortOrder)
}

const getSortOrder = (order: TopicSummarySortOrder) => {
  if (order === 'mostPlayed') {
    return popularSort
  } else if (order === 'featured') {
    return featuredSort
  } else {
    return newSort
  }
}

const popularSort = (a: ITopicSummary, b: ITopicSummary) => {
  if (a.rankScore < rankScoreHarshEffectThreshold) {
    return b.rankScore - a.rankScore
  }

  if (b.rankScore < rankScoreHarshEffectThreshold) {
    return b.rankScore - a.rankScore
  }

  return b.totalGamesPlayedCount - a.totalGamesPlayedCount
}

const featuredSort = (a: ITopicSummary, b: ITopicSummary) => {
  const aScore = getFeaturedScore(a)
  const bScore = getFeaturedScore(b)

  return bScore - aScore
}

/**
 * Returns a score that takes recency and
 * popularity into account. Configurable by
 * adjusting the scoreMultiplier
 */
const getFeaturedScore = (s: ITopicSummary) =>
  getRecencyScore(s.createdAtTimestamp, 3.5) +
  getPopularityScore(s.totalGamesPlayedCount, 0.2) +
  s.rankScore

const baseRecencyScore = 10
// 2592000000 === 1 month in ms
const getRecencyScore = (timestamp: number, scoreMultiplier: number) =>
  (baseRecencyScore - (Date.now() - timestamp) / 2592000000) * scoreMultiplier

const getPopularityScore = (timesPlayed: number, scoreMultiplier: number) =>
  timesPlayed * scoreMultiplier

const newSort = (a: ITopicSummary, b: ITopicSummary) => {
  if (a.rankScore < rankScoreHarshEffectThreshold) {
    return b.rankScore - a.rankScore
  }

  if (b.rankScore < rankScoreHarshEffectThreshold) {
    return b.rankScore - a.rankScore
  }

  /**
   * topics are returned in this order from endpoint, so just handle
   * rank scores below rankScoreHarshEffectThreshold.
   */
  return 1
}
