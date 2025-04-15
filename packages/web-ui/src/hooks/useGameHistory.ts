import { useRef } from 'react'

type Choice = {
  id: string
  isWinner: boolean
}
type Match = Choice[]
type Round = Match[]

export type GameHistory = Round[]

const useGameHistory = () => {
  const gameHistoryRef = useRef<GameHistory>([[]])

  const handleNewRound = () => {
    gameHistoryRef.current.push([])
  }

  const handleMatch = (choiceIds: string[], winningChoiceId: string) => {
    const latestRound =
      gameHistoryRef.current[gameHistoryRef.current.length - 1]
    const latestMatch: Match = choiceIds.map((cId) => ({
      id: cId,
      isWinner: winningChoiceId === cId,
    }))
    latestRound.push(latestMatch)
  }

  return {
    handleNewRound,
    handleMatch,
    gameHistory: gameHistoryRef.current,
  }
}

export default useGameHistory
