import { IChoice, ITopic, IIncrementTopicPayload } from '@ovo/data-api'
import axios from 'axios'
import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import useGameHistory, { GameHistory } from '../hooks/useGameHistory'
import useIncrementLocalTopic from '../hooks/useIncrementLocalTopic'
import useIsLTEML from '../hooks/useIsLTEML'
import { useUserIdentifiers } from '../hooks/useUserIdentifiers'
import { getMaxPowerOfTwo } from '../lib/game'
import { getMediaUrl } from '../lib/images'
import { TopicsUserParams } from '../lib/topic'
import {
  black,
  gapUnitPx,
  getRgba,
  mobileLandscapeBreakpointPx,
  white,
} from '../theme'
import { PlainButton } from './PlainButton'
import VS from './VS'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

const ROUND_ADVANCE_DELAY_MS = 1300

/**
 * When a round is played, increment the topic's choice records
 */
const incrementTopic = async (
  topicId: string,
  incrementTopicPayload: IIncrementTopicPayload,
  params: TopicsUserParams
) => {
  await axios.post(
    `${API_ENDPOINT_TOPICS}/${topicId}/increment`,
    incrementTopicPayload,
    {
      params,
    }
  )
}

const getNRandomElems = (arr: string[], n: number) => {
  const shuffled = arr.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

const getValidChoiceIds = (arr: string[], numChoices?: number) => {
  const maxItems = getMaxPowerOfTwo(arr.length)
  return getNRandomElems(arr, numChoices || maxItems)
}

type PanelPlacement = 'left' | 'right'

interface IGameProps extends ComponentPropsWithoutRef<'div'> {
  topic: ITopic
  onWinner: (
    winner: IChoice,
    localUpdatedTopic: ITopic,
    gameHistory: GameHistory
  ) => void
  numChoices?: number
}

const Game: React.FC<IGameProps> = ({
  topic,
  onWinner,
  numChoices,
  ...props
}) => {
  const { deviceId, userId } = useUserIdentifiers()

  const isLTEML = useIsLTEML()

  const choices = topic.choices

  const initialChoiceIdsRef = useRef<string[]>([])

  /**
   * Array of choice Ids that are yet to be played in this round
   */
  const [choiceIdsCurrRound, setChoiceIdsCurrRound] = useState<string[]>(() => {
    /**
     * Gets the supremum power of two for number of choice Ids
     */
    const randomChoiceIds = getValidChoiceIds(topic.choiceIds, numChoices)
    initialChoiceIdsRef.current = randomChoiceIds
    return randomChoiceIds
  })

  /**
   * Array of choice Ids that are to be played in the next round
   */
  const [choiceIdsNextRound, setChoiceIdsNextRound] = useState<string[]>([])

  /**
   * Stores the index that won to apply some styling
   */
  const [roundWinningIndex, setRoundWinningIndex] = useState<undefined | 0 | 1>(
    undefined
  )

  /**
   * Whether to hide other elements to give feedback that the winner was chosen
   */
  const [isShowingWinner, setIsShowingWinner] = useState<boolean>(false)

  /**
   * Maintain a reference to the topic, to update the records locally
   */
  const { localTopic, incrementLocalTopic } = useIncrementLocalTopic(topic)

  /**
   * Maintain game history as game played
   */
  const { handleNewRound, handleMatch, gameHistory } = useGameHistory()

  /**
   * Rounds player
   *
   * If exhausted all the choiceIds that are to be played,
   * choices that were picked will be played for the upcoming round.
   *
   * If only 1 choice remains to be played the next round, the game is over.
   */
  useEffect(() => {
    if (choiceIdsCurrRound.length === 0) {
      handleNewRound()

      if (choiceIdsNextRound.length === 1) {
        const winner = choices[choiceIdsNextRound[0]]

        if (!winner) {
          throw new Error('Could not get the choice that won')
        }
        handleMatch([winner.id], winner.id)
        onWinner(winner, localTopic, gameHistory)
      }
      if (choiceIdsNextRound.length === 0) {
        throw new Error('The game was completed but there was no winner')
      }

      setChoiceIdsCurrRound(choiceIdsNextRound)
      setChoiceIdsNextRound([])
    }
  }, [
    choiceIdsNextRound,
    choiceIdsCurrRound.length,
    choices,
    onWinner,
    localTopic,
    handleNewRound,
    handleMatch,
    gameHistory,
  ])

  const currentMatchChoiceIds = useMemo(
    () => getNRandomElems(choiceIdsCurrRound, 2),
    [choiceIdsCurrRound]
  )

  const handleSelection = useCallback(
    (choiceId: string) => {
      if (!isShowingWinner) {
        setRoundWinningIndex(
          choiceIdsCurrRound.findIndex((id) => id === choiceId) as 0 | 1
        )
        setIsShowingWinner(true)
        /**
         * Note: in order to keep requests atomic
         * (ie. prevent drift between topic.gamesCompletedCount
         * and choice.totalWinCount), derive whether it's the final round
         * imperatively here to compose a single request.
         */
        const isFinalRound =
          choiceIdsCurrRound.length === 2 && choiceIdsNextRound.length === 0
        const incrementTopicPayload: IIncrementTopicPayload = {
          roundPlayedChoiceIds: currentMatchChoiceIds,
          roundWonChoiceId: choiceId,
          gameWonChoiceId: isFinalRound ? choiceId : undefined,
          gamePlayedChoiceIds: isFinalRound
            ? initialChoiceIdsRef.current
            : undefined,
        }
        incrementLocalTopic(incrementTopicPayload)
        incrementTopic(topic.id, incrementTopicPayload, {
          deviceId,
          userId,
        })

        handleMatch(currentMatchChoiceIds, choiceId)

        setTimeout(() => {
          // IMPROVE: upgrade to React 18+ for batch updates
          setChoiceIdsNextRound((prev) => [...prev, choiceId])

          setChoiceIdsCurrRound((prev) =>
            prev.filter((id) => !currentMatchChoiceIds.includes(id))
          )

          setRoundWinningIndex(undefined)
          setIsShowingWinner(false)
        }, ROUND_ADVANCE_DELAY_MS)
      }
    },
    [
      isShowingWinner,
      choiceIdsCurrRound,
      choiceIdsNextRound.length,
      currentMatchChoiceIds,
      incrementLocalTopic,
      topic.id,
      deviceId,
      userId,
      handleMatch,
    ]
  )

  const roundNumChoices =
    choiceIdsCurrRound.length + choiceIdsNextRound.length * 2
  const roundIndex = `${choiceIdsNextRound.length + 1} / ${roundNumChoices / 2}`
  const roundDescription =
    roundNumChoices === 2
      ? 'Finals'
      : `Round of ${roundNumChoices} (${roundIndex})`

  /**
   * FIXME: Account for window resizing to reinstantiate these
   * measured image widths.
   */
  const [imageElementDims, setImageElementDims] = useState<
    Record<string, number>
  >({})

  return (
    <GameContainer {...props}>
      <div>
        {isLTEML ? (
          <GameTitle>
            <CompactTopicH1 title={topic.description}>
              {topic.name}
            </CompactTopicH1>
            <div>{roundDescription}</div>
          </GameTitle>
        ) : (
          <GameTitle>
            <TopicH1 title={topic.description}>{topic.name}</TopicH1>
            <div>{roundDescription}</div>
          </GameTitle>
        )}
      </div>
      <Round>
        {currentMatchChoiceIds.map((choiceId, index) => {
          const choice = choices[choiceId]

          if (!choice) {
            throw new Error('Tried to select a choice that did not exist')
          }

          const placement = index === 0 ? 'left' : 'right'
          const isWinner = roundWinningIndex === index

          const handlePanelClick = () => {
            handleSelection(choiceId)
          }

          const imgDimPx = imageElementDims[choice.id]
          const imgHalfDimPx = imageElementDims[choice.id] / 2 || 0

          return (
            <PanelButton
              key={choice.id}
              isVisible={!isShowingWinner || isWinner}
              placement={placement}
              onClick={handlePanelClick}
              isLTEML={isLTEML}
            >
              <Image
                ref={(ref) => {
                  if (
                    ref &&
                    typeof imageElementDims[choice.id] === 'undefined'
                  ) {
                    const dimensionPx = isLTEML
                      ? ref.clientHeight
                      : ref.clientWidth
                    setImageElementDims((prev) => ({
                      ...prev,
                      [choice.id]: dimensionPx,
                    }))
                  }
                }}
                src={getMediaUrl(choice.mediaSrc)}
                alt={`${choice.name} Image`}
                offsetPx={isWinner ? imgHalfDimPx : 0}
                placement={placement}
                isLTEML={isLTEML}
              />
              <ChoiceNameContainer
                offsetPx={isWinner ? imgHalfDimPx : 0}
                placement={placement}
                widthPx={imgDimPx}
                isLTEML={isLTEML}
              >
                <ChoiceName isLTEML={isLTEML}>{choice.name}</ChoiceName>
              </ChoiceNameContainer>
            </PanelButton>
          )
        })}
        <PositionedVS
          isVisible={!isShowingWinner}
          size={isLTEML ? 'small' : 'large'}
        />
      </Round>
    </GameContainer>
  )
}

const GameContainer = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 90vh;
`

const GameTitle = styled.div`
  text-align: center;
  margin-bottom: ${gapUnitPx}px;
  padding: 0 ${gapUnitPx * 4}px;
`

const TopicH1 = styled.h1`
  margin-bottom: ${gapUnitPx}px;
`

const CompactTopicH1 = styled(TopicH1)`
  font-size: 18px;
`

const Round = styled.div`
  display: grid;
  position: relative;

  @media (min-width: ${mobileLandscapeBreakpointPx + 1}px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(0, 1fr);
  }

  @media (max-width: ${mobileLandscapeBreakpointPx}px) {
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  }

  grid-gap: ${gapUnitPx}px;

  height: 100%;
`

const PanelButton = styled(PlainButton)<{
  isVisible: boolean
  placement: PanelPlacement
  isLTEML: boolean
}>`
  display: flex;
  height: 100%;
  position: relative;

  ${({ isVisible }) =>
    !isVisible &&
    `
    opacity: 0;
  `}

  ${({ placement, isLTEML }) =>
    placement === 'left'
      ? `
      ${
        isLTEML
          ? `
    justify-content: center;
    align-items: flex-end;
      `
          : `
      justify-content: flex-end;
      `
      }
      `
      : `
      ${
        isLTEML
          ? `
    justify-content: center;
    align-items: flex-start;
      `
          : ``
      }
  `}

  transition: opacity 0.3s ease-out;
`

const Image = styled.img<{
  offsetPx: number
  placement: PanelPlacement
  isLTEML: boolean
}>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;

  ${({ placement, offsetPx, isLTEML }) =>
    placement === 'left'
      ? `
    ${
      isLTEML
        ? `
      transform: translate(0, ${offsetPx}px);
    `
        : `
      transform: translate(${offsetPx}px, 0);
    `
    }
    `
      : `
      ${
        isLTEML
          ? `
      transform: translate(0, -${offsetPx}px);
      `
          : `
      transform: translate(-${offsetPx}px, 0);
      `
      }
  `}

  transition: transform 0.3s ease-out;
`

const ChoiceNameContainer = styled.span<{
  widthPx?: number
  offsetPx: number
  placement: PanelPlacement
  isLTEML: boolean
}>`
  pointer-events: none;
  position: absolute;
  top: 0;

  display: flex;
  width: ${({ widthPx }) => (widthPx ? `${widthPx}px` : 'auto')};
  height: 100%;

  ${({ isLTEML }) =>
    !isLTEML &&
    `
    margin-top: 30%;
  `}

  align-items: center;
  justify-content: center;

  ${({ placement, offsetPx, isLTEML }) =>
    placement === 'left'
      ? `
    ${
      isLTEML
        ? `
      transform: translate(0, ${offsetPx}px);
    `
        : `
      transform: translate(${offsetPx}px, 0);
    `
    }
    `
      : `
      ${
        isLTEML
          ? `
      transform: translate(0, -${offsetPx}px);
      `
          : `
      transform: translate(-${offsetPx}px, 0);
      `
      }
  `}

  transition: transform 0.3s ease-out;
`

const ChoiceName = styled.span<{
  isLTEML: boolean
}>`
  z-index: 3;

  font-size: ${({ isLTEML }) => (isLTEML ? `18px` : `28px`)};
  background-color: ${getRgba(black, 0.5)};
  color: ${white};
  border-radius: 8px;

  padding: 0 ${gapUnitPx * 4}px;
}

  transition: background-color 0.3s ease-out, transform 0.2s ease-out;
`

const PositionedVS = styled(({ isVisible, size, ...props }) => (
  <VS {...props} />
))`
  position: absolute;

  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;

  bottom: 40%;

  ${({ isVisible }) =>
    !isVisible &&
    `
  opacity: 0;
`}

  z-index: 4;

  ${({ size }) =>
    size === 'small'
      ? `
    bottom: 45%;
    height: 70px;
  `
      : ``}
`

export default Game
