import { IIncrementTopicPayload, ITopic } from '@ovo/data-api'
import { useCallback, useState } from 'react'

/**
 * Returns a local topic and a incrementer function
 */
const useIncrementLocalTopic = (initTopic: ITopic) => {
  const [localTopic, setLocalTopic] = useState(initTopic)

  const incrementLocalTopic = useCallback(
    (incrementTopicPayload: IIncrementTopicPayload) => {
      let nextTopic = { ...localTopic }

      const {
        roundPlayedChoiceIds,
        roundWonChoiceId,
        gameWonChoiceId,
        gamePlayedChoiceIds,
      } = incrementTopicPayload

      roundPlayedChoiceIds.forEach((choiceId) => {
        const playedChoice = nextTopic.choices[choiceId]
        if (!playedChoice) {
          throw new Error('Could not derive the played choice')
        }

        nextTopic = {
          ...nextTopic,
          choices: {
            ...nextTopic.choices,
            [choiceId]: {
              ...playedChoice,
              record: {
                ...playedChoice.record,
                roundsPlayedCount: ++playedChoice.record.roundsPlayedCount,
                roundsWinCount:
                  roundWonChoiceId === choiceId
                    ? ++playedChoice.record.roundsWinCount
                    : playedChoice.record.roundsWinCount,
              },
            },
          },
        }
      })

      if (gameWonChoiceId) {
        const wonChoice = nextTopic.choices[gameWonChoiceId]
        if (!wonChoice) {
          throw new Error('Could not derive the won choice')
        }

        nextTopic = {
          ...nextTopic,
          choices: {
            ...nextTopic.choices,
            [gameWonChoiceId]: {
              ...wonChoice,
              record: {
                ...wonChoice.record,
                totalWinCount: ++wonChoice.record.totalWinCount,
              },
            },
          },
        }
      }

      if (gamePlayedChoiceIds?.length) {
        gamePlayedChoiceIds.forEach((choiceId) => {
          const playedChoice = nextTopic.choices[choiceId]
          if (!playedChoice) {
            throw new Error('Could not derive the played choice')
          }

          nextTopic = {
            ...nextTopic,
            choices: {
              ...nextTopic.choices,
              [choiceId]: {
                ...playedChoice,
                record: {
                  ...playedChoice.record,
                  gamesPlayedCount: ++playedChoice.record.gamesPlayedCount,
                },
              },
            },
          }
        })
      }

      setLocalTopic(nextTopic)
    },
    [localTopic]
  )

  return {
    localTopic,
    incrementLocalTopic,
  }
}

export default useIncrementLocalTopic
