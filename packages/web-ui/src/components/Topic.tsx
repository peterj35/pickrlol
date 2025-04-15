import { IChoice, ITopic } from '@ovo/data-api'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useStoredGameResult from '../hooks/useStoredGameResult'
import Button, { ButtonWithTopMargin } from './Button'
import FullScreenOverlay from './FullScreenOverlay'
import Game from './Game'
import Loading from './Loading'
import NarrowView from './NarrowView'
import { useAuth0 } from '@auth0/auth0-react'
import { ChoiceShowcaseWithMargin } from './ChoiceShowcase'
import { getMediaUrl } from '../lib/images'
import { TopicResultsAccordionWithMargin } from './TopicResultsAccordion'
import { objToArr } from '../lib/lang'
import Bold from './Bold'
import { sortByGameResults, sortByRoundResults } from '../lib/choice'
import { fetchTopic, getTopChoices, getTotalPlayedCount } from '../lib/topic'
import styled from 'styled-components'
import Sharebar from './ShareBar'
import ago from 's-ago'
import { smallFontPx } from '../theme'
import OtherTopicsCta from './OtherTopicsCTA'
import InlineImages from './InlineImages'
import useUploadProgress from '../hooks/useUploadProgress'
import { Helmet } from 'react-helmet'
import PreGame from './PreGame'
import { HorizontalButtonContainer } from './ButtonContainer'
import TopicCommentsContainer from './TopicCommentsContainer'
import { GameHistory } from '../hooks/useGameHistory'
import GameHistoryCanvasImage from './GameHistoryCanvasImage'
import { useUserIdentifiers } from '../hooks/useUserIdentifiers'
import { TopicUploadingOverlay } from './TopicUploadingOverlay'

interface ITopicParams {
  topicId: string
}

interface ITopicHistoryType {
  topic?: ITopic
}

interface ITopicProps {}

const uploadingMsg = 'This topic is currently being created, hang tight...'

const Topic: React.FC<ITopicProps> = () => {
  const { user } = useAuth0()
  const userSub = user?.sub

  const { topicId } = useParams<ITopicParams>()
  const history = useHistory<ITopicHistoryType>()
  const topicFromHist = history.location?.state?.topic

  const [topic, setTopic] = useState<ITopic | undefined>(topicFromHist)

  const [storedGameResult, setStoredGameResult] = useStoredGameResult(topicId)

  const [uploadProgress] = useUploadProgress()

  const { deviceId } = useUserIdentifiers()

  /**
   * Fetch the topic from remote if not available from history
   */
  useEffect(() => {
    if (!topicFromHist && !topic) {
      const getAndSetTopicFromRemote = async () => {
        const topicFromRemote = await fetchTopic(topicId, {
          deviceId,
          // Cannot wait for this
          userId: '',
        })
        setTopic(topicFromRemote)
      }
      getAndSetTopicFromRemote()
    }
  }, [deviceId, topic, topicFromHist, topicId])

  /**
   * Whether the fullscreen game overlay is visible or not
   */
  const [isGameVisible, setIsGameVisible] = useState<boolean>(false)
  const [gameNumChoices, setGameNumChoices] = useState<number | undefined>(
    undefined
  )

  const handleGameOpen = useCallback(() => {
    setIsGameVisible(true)
  }, [])

  const handleGameClose = useCallback(() => {
    setIsGameVisible(false)
  }, [])

  /**
   * Whether game settings overlay is visible or not
   */
  const [isPreGameVisible, setIsPreGameVisible] = useState<boolean>(false)

  const handlePreGameOpen = useCallback(() => {
    setIsPreGameVisible(true)
  }, [])

  const handlePreGameClose = useCallback(() => {
    setIsPreGameVisible(false)
  }, [])

  const handlePreGameComplete = useCallback(
    (numChoices: number) => {
      setGameNumChoices(numChoices)
      handleGameOpen()
      handlePreGameClose()
    },
    [handleGameOpen, handlePreGameClose]
  )

  const handleWinner = useCallback(
    (winner: IChoice, localUpdatedTopic: ITopic, gameHistory: GameHistory) => {
      setStoredGameResult(winner, gameHistory, userSub)
      setIsGameVisible(false)
      setTopic(localUpdatedTopic)
    },
    [setStoredGameResult, userSub]
  )

  const handleGameReset = useCallback(() => {
    setStoredGameResult(undefined, userSub)
    setGameNumChoices(undefined)
  }, [setStoredGameResult, userSub])

  const storedSelectedChoiceId = storedGameResult?.selectedChoiceId
  const prevSelectedChoice = storedSelectedChoiceId
    ? topic?.choices[storedSelectedChoiceId]
    : undefined

  const topicResultsProps = useMemo(
    () =>
      topic
        ? {
            choices: objToArr<IChoice>(topic.choices),
            isChoicesModalAllowed: Boolean(prevSelectedChoice),
          }
        : undefined,
    [prevSelectedChoice, topic]
  )

  const prevSelectedChoiceGameWonRank = useMemo(() => {
    if (!prevSelectedChoice || !topic) {
      return null
    }
    const choices = objToArr(topic!.choices)
    const sortedChoices = choices.sort(sortByGameResults)
    return (
      sortedChoices.findIndex(
        (choice) => choice.id === prevSelectedChoice?.id
      ) + 1
    )
  }, [prevSelectedChoice, topic])

  const prevSelectedChoiceRoundWonRank = useMemo(() => {
    if (!prevSelectedChoice || !topic) {
      return null
    }
    const choices = objToArr(topic!.choices)
    const sortedChoices = choices.sort(sortByRoundResults)
    return (
      sortedChoices.findIndex(
        (choice) => choice.id === prevSelectedChoice?.id
      ) + 1
    )
  }, [prevSelectedChoice, topic])

  const toolbarRenderer = useCallback(() => {
    if (!topic) {
      return null
    }

    return (
      <Toolbar>
        <MetaInfo>Created {ago(new Date(topic.createdAtTimestamp))}</MetaInfo>
        <Sharebar />
      </Toolbar>
    )
  }, [topic])

  const topImgSrcs = useMemo(() => {
    if (!topic) {
      return []
    }

    return getTopChoices(topic.choices).map((choice) =>
      getMediaUrl(choice.mediaSrc)
    )
  }, [topic])

  const isTopicUploading =
    uploadProgress.assetId === topic?.id &&
    uploadProgress.progress === 'uploading'

  /**
   * Bandaid fix for when the overlay disappears, the scroll position is
   * at the bottom
   *
   * IMPROVE @peterj35: root-cause, fix, and remove this bandaid
   */
  useEffect(() => {
    if (!isTopicUploading) {
      window.scrollTo(0, 0)
    }
  }, [isTopicUploading])

  if (!topic) {
    return (
      <NarrowView centering>
        <Loading />
      </NarrowView>
    )
  }

  if (!topicResultsProps) {
    throw new Error('Results props should have been defined')
  }

  if (prevSelectedChoice) {
    return (
      <>
        <Helmet>
          <title>{topic.name} | Pickr</title>
          <meta property="og:image" content={topImgSrcs[0]} />
          <meta
            name="description"
            content={`Pick ${topic.name} - ${topic.description}`}
          />
          <meta content={topImgSrcs[0]} property="twitter:image" />
        </Helmet>
        <NarrowView centering>
          {toolbarRenderer()}

          <h1>{topic.name}</h1>

          <div>
            Out of <Bold>{topic.choiceIds.length}</Bold> total choices...
          </div>

          <ChoiceShowcaseWithMargin
            name={prevSelectedChoice.name}
            mediaSrc={getMediaUrl(prevSelectedChoice.mediaSrc)}
          >
            <div>
              Won <Bold>{prevSelectedChoice.record.totalWinCount}</Bold> out of{' '}
              <Bold>{prevSelectedChoice.record.gamesPlayedCount}</Bold> total
              games (Rank <Bold>{prevSelectedChoiceGameWonRank}</Bold>)
            </div>
            <div>
              Won <Bold>{prevSelectedChoice.record.roundsWinCount}</Bold> out of{' '}
              <Bold>{prevSelectedChoice.record.roundsPlayedCount}</Bold> total
              rounds (Rank <Bold>{prevSelectedChoiceRoundWonRank}</Bold>)
            </div>
          </ChoiceShowcaseWithMargin>

          <GameHistoryCanvasImage topic={topic} />

          <TopicResultsAccordionWithMargin
            topicResultsProps={topicResultsProps}
          />
          <ButtonWithTopMargin onClick={handleGameReset}>
            Play again
          </ButtonWithTopMargin>
        </NarrowView>
        <NarrowView>
          <TopicCommentsContainer
            topicId={topic.id}
            comments={topic.comments}
            wonChoice={prevSelectedChoice}
          />
        </NarrowView>
        <OtherTopicsCta />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{topic.name} | Pickr</title>
        <meta property="og:image" content={topImgSrcs[0]} />
        <meta
          name="description"
          content={`Pick ${topic.name} - ${topic.description}`}
        />
        <meta content={topImgSrcs[0]} property="twitter:image" />
      </Helmet>
      <TopicUploadingOverlay topicId={topic.id} />
      <NarrowView centering>
        {toolbarRenderer()}
        <TopicName>{topic.name}</TopicName>
        <StaticHeightInlineImages imgSrcs={topImgSrcs} hasBottomBorderRadius />
        <p>{topic.description}</p>
        <HorizontalButtonContainer>
          <p>Played {getTotalPlayedCount(topic)} times</p>
          <p>{topic.choiceIds.length} total choices</p>
        </HorizontalButtonContainer>
        <Button
          onClick={gameNumChoices ? handleGameOpen : handlePreGameOpen}
          state={isTopicUploading ? 'wait' : undefined}
          stateMsg={uploadingMsg}
        >
          {isTopicUploading ? `Uploading...` : `Go!`}
        </Button>
        <TopicResultsAccordionWithMargin
          topicResultsProps={topicResultsProps}
        />
        <div />
      </NarrowView>
      <NarrowView>
        <TopicCommentsContainer
          topicId={topic.id}
          comments={topic.comments}
          wonChoice={prevSelectedChoice}
        />
      </NarrowView>
      <OtherTopicsCta />
      <FullScreenOverlay
        isVisible={isPreGameVisible}
        onClose={handlePreGameClose}
      >
        <PreGame
          numChoices={topic.choiceIds.length}
          onComplete={handlePreGameComplete}
        />
      </FullScreenOverlay>
      <FullScreenOverlay
        isVisible={isGameVisible}
        onClose={handleGameClose}
        hasTransition={isGameVisible ? false : true}
      >
        <Game
          key={gameNumChoices}
          topic={topic}
          onWinner={handleWinner}
          numChoices={gameNumChoices}
        />
      </FullScreenOverlay>
    </>
  )
}

const TopicName = styled.h1``

const StaticHeightInlineImages = styled(InlineImages)`
  height: 120px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MetaInfo = styled.div`
  font-size: ${smallFontPx}px;
`

export default Topic
