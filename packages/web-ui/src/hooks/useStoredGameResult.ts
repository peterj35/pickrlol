import { IChoice } from '@ovo/data-api'
import { useCallback, useMemo } from 'react'
import { GAME_RESULTS_KEY } from '../lib/localStorage'
import { GameHistory } from './useGameHistory'
import useLocalStorage from './useLocalStorage'

type GameResult = {
  selectedChoiceId: string
  completedAtTimestamp: number
  userId?: string
  gameHistory?: GameHistory
}

type TopicId = string

type LocalGameResultsRecord = Record<TopicId, GameResult | undefined>

/**
 * Given a topicId, return the value and setter for the previous game result
 * saved in local storage.
 */
const useStoredGameResult = (
  topicId: string
): [
  GameResult | undefined,
  (
    winner: IChoice | undefined,
    gameHistory: GameHistory,
    userId?: string
  ) => void
] => {
  const [
    storedGameResults,
    setStoredGameResults,
  ] = useLocalStorage<LocalGameResultsRecord>(GAME_RESULTS_KEY, {})

  const storedGameResult = useMemo(() => storedGameResults[topicId], [
    storedGameResults,
    topicId,
  ])

  const setStoredGameResult = useCallback(
    (
      winner: IChoice | undefined,
      gameHistory: GameHistory,
      userId?: string
    ) => {
      if (!winner) {
        setStoredGameResults({
          ...storedGameResults,
          [topicId]: undefined,
        })
        return
      }

      setStoredGameResults({
        ...storedGameResults,
        [topicId]: {
          selectedChoiceId: winner.id,
          completedAtTimestamp: Date.now(),
          userId,
          gameHistory,
        },
      })
    },
    [setStoredGameResults, storedGameResults, topicId]
  )

  return [storedGameResult, setStoredGameResult]
}

export default useStoredGameResult
