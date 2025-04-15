import { IChoice } from '../choices'
import { ITopicComment } from './comment'

export interface ITopic {
  id: string
  name: string
  description: string
  createdAtTimestamp: number
  choiceIds: string[]
  choices: ChoicesRecord
  creatorId: string
  comments?: ITopicComment[]
  isArchived: boolean

  // Optional for backwards compat.
  tagNames?: string[]

  /**
   * Optional for backwards compat. Undefined is equiv. to 0.
   */
  rankScore?: number
}

export type ChoicesRecord = Record<string, IChoice | undefined>

export interface ITopicSummary {
  id: ITopic['id']
  name: ITopic['name']
  description: ITopic['description']
  createdAtTimestamp: ITopic['createdAtTimestamp']
  creatorId: ITopic['creatorId']
  topChoiceMediaSrcs: string[]
  choicesChosenCount: number
  totalChoiceCount: number
  totalGamesPlayedCount: number
  // Not tagNames: ITopic['tagNames'] because this will always be defined.
  tagNames: string[]
  // Not tagNames: ITopic['rankScore'] because this will always be defined.
  rankScore: number
}
