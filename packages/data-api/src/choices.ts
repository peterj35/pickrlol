export interface IChoice {
  id: string
  name: string
  record: IChoiceRecord
  mediaSrc: string
  thumbMediaSrc?: string
  /**
   * Only used to store file data before uploading it
   * IMPROVE: define at component level where it is only used
   */
  mediaFile?: any
}

export interface IChoiceRecord {
  totalWinCount: number
  roundsWinCount: number
  roundsPlayedCount: number
  gamesPlayedCount: number
}
