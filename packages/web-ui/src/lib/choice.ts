import { ChoicesRecord, IChoice } from '@ovo/data-api'
import { getLongId } from './id'

export const getNewChoice = (initValues: Partial<IChoice>) => {
  const mediaSrc = initValues.mediaSrc

  if (!mediaSrc) {
    throw new Error('Must specify a mediaSrc to get a new choice')
  }

  return {
    id: getLongId(),
    name: '',
    record: {
      totalWinCount: 0,
      roundsWinCount: 0,
      roundsPlayedCount: 0,
      gamesPlayedCount: 0,
    },
    mediaSrc,
    ...initValues,
  }
}

export const sortByGameResults = (a: IChoice, b: IChoice) =>
  b.record.totalWinCount - a.record.totalWinCount

export const sortByRoundResults = (a: IChoice, b: IChoice) =>
  b.record.roundsWinCount - a.record.roundsWinCount

export const sortByRoundResultsAccountingGame = (a: IChoice, b: IChoice) => {
  if (b.record.totalWinCount !== a.record.totalWinCount) {
    return 1
  }
  return b.record.roundsWinCount - a.record.roundsWinCount
}

export const getChoicesList = (ids: string[], choicesRec: ChoicesRecord) => {
  const choices = ids.map((choiceId) => {
    const choice = choicesRec[choiceId]
    if (typeof choice === 'undefined') {
      throw new Error(
        `Could not find corresponding choice for, 
          ${choiceId}`
      )
    }
    return choice
  })
  return choices
}
