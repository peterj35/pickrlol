import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import {
  backgroundColorAccentPrimary,
  gapUnitPx,
  tabletBreakpointPx,
} from '../theme'
import { ITopic, ITopicSummary } from '@ovo/data-api'
import { ClickableTopicTile } from './TopicTile'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { LargeLoading } from './Loading'
import { fetchTopics, updateTopic } from '../lib/topic'
import { getTopicSummaries, TopicSummarySortOrder } from '../lib/topicSummary'
import useLocalStorage from '../hooks/useLocalStorage'
import { TOPICS_SORT_ORDER_KEY } from '../lib/localStorage'
import TopicSortOrderSelector from './TopicSortOrderSelector'
import useTopicNavigation from '../hooks/useTopicNavigation'
import { Helmet } from 'react-helmet'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import useIsLTEML from '../hooks/useIsLTEML'
import { useUserIdentifiers } from '../hooks/useUserIdentifiers'
import TagFilterSelector, { collapsedMaxHeightPx } from './TagFilterSelector'
import { useFetchTags } from '../hooks/useFetchTags'
import { useStoredTagNameSelections } from '../hooks/useStoredTagNameSelections'
import { VisibilityContainer } from './VisibilityContainer'
import { Sticky } from './Sticky'

export const TILE_TABLET_WIDTH_PX = 328
const TOPIC_HEIGHT_PX = 300

const TOPICS_GRID_GAP_PX = gapUnitPx * 8
const TOPICS_GRID_HORZ_MARGIN_PX = gapUnitPx * 4
const TOPICS_DESKTOP_GRID_REPEAT = 3
const MIN_TOPIC_WIDTH_DESKTOP_PX =
  (tabletBreakpointPx - TOPICS_GRID_GAP_PX - TOPICS_GRID_HORZ_MARGIN_PX * 2) /
  TOPICS_DESKTOP_GRID_REPEAT

interface ITopicsProps extends ComponentPropsWithoutRef<'div'> {}

const Topics: React.FC<ITopicsProps> = ({ ...props }) => {
  const match = useRouteMatch('/')

  const history = useHistory()

  const isLTEML = useIsLTEML()
  const topicsDisplayBatchSize = isLTEML ? 4 : 9

  const [sortOrder, setSortOrder] = useLocalStorage<TopicSummarySortOrder>(
    TOPICS_SORT_ORDER_KEY,
    'featured'
  )
  const [topicSummaries, setTopicSummaries] = useState<ITopicSummary[]>([])
  const topicsRef = useRef<ITopic[]>([])
  const [numTopicsDisplayed, setNumTopicsDisplayed] = useState<number>(
    topicsDisplayBatchSize
  )

  const { userId, deviceId } = useUserIdentifiers()

  const onBottomScroll = useCallback(() => {
    setNumTopicsDisplayed((prev) => prev + topicsDisplayBatchSize)
  }, [topicsDisplayBatchSize])

  useBottomScrollListener(onBottomScroll, {
    offset: 400,
    triggerOnNoScroll: true,
  }) as React.RefObject<HTMLDivElement>

  const [activeTagNames, setActiveTagNames] = useStoredTagNameSelections()

  useEffect(() => {
    const getAndSetTopics = async () => {
      if (topicsRef.current.length === 0) {
        topicsRef.current = await fetchTopics(
          {
            deviceId,
            // We cannot wait for this
            userId: '',
          }
          // Turning off serverside topics fetching per tag names in favour of
          // clientside sorting
          // , activeTagNames
        )
      }

      let filteredTopics = topicsRef.current
      if (activeTagNames.length && topicsRef.current) {
        filteredTopics = topicsRef.current.filter((t) =>
          t.tagNames?.some((topicTag) => activeTagNames.includes(topicTag))
        )
      }

      const topicSummaries = getTopicSummaries(filteredTopics, sortOrder)
      setTopicSummaries(topicSummaries)
    }

    getAndSetTopics()
  }, [activeTagNames, deviceId, sortOrder])

  const handleTopicSortOrderSelectorChange = useCallback(
    (value: TopicSummarySortOrder) => {
      setSortOrder(value)
    },
    [setSortOrder]
  )

  const navigateTopic = useTopicNavigation()

  const handleTopicClick = useCallback(
    (topicId: string, topicName: string) => {
      navigateTopic(topicId, topicName)
    },
    [navigateTopic]
  )

  const handleEditTopic = useCallback(
    (topicId: string) => {
      history.push(`/edit/${topicId}`)
    },
    [history]
  )

  const handleDeleteTopic = (topicId: string) => {
    setTopicSummaries(topicSummaries.filter((topic) => topic.id !== topicId))
  }

  const renderedTopicSummaries = useMemo(
    () =>
      topicSummaries.length ? topicSummaries.slice(0, numTopicsDisplayed) : [],
    [numTopicsDisplayed, topicSummaries]
  )

  const tags = useFetchTags()

  const handleTagChange = (nextTagIds: string[]) => {
    setActiveTagNames(nextTagIds)
  }

  const handleEditTopicRankScore = async (
    topicId: string,
    nextRankScore: number
  ) => {
    const t = topicsRef.current.find((t) => t.id === topicId)

    if (!t) {
      alert(`Could not find topic of ID ${topicId}`)
      return
    }

    const nextTopic: ITopic = {
      ...t,
      rankScore: nextRankScore,
    }

    await updateTopic(t.id, nextTopic, {
      deviceId,
      userId,
    })

    alert('Rank score updated! Refreshing the page...')
    window.location.reload()
  }

  const [isToolbarSticky, setIsToolbarSticky] = useState<boolean>(false)
  const handleOnToolbarSticky = (isSticky: boolean) => {
    setIsToolbarSticky(isSticky)
  }

  /**
   * Don't render the component if there's no match. Needed to not unmount
   * the component if the route doesn't match, for better UX. Refer to usage in
   * <App />
   *
   * IMPROVE @peterj35: Make more declarative and encapsulate this logic better,
   * eg. by creating a <NonUnmountingRoute /> or such.
   */
  if (!match?.isExact) {
    return null
  }

  if (topicSummaries.length === 0) {
    // TODO: Add timeout to show feedback to user if no topics were fetched after a certain time
    return <LargeLoading />
  }

  return (
    <Container {...props}>
      <Helmet>
        <title>Pickr</title>
        <meta property="og:image" content="https://pickr.lol/og.png" />
        <meta name="description" content="Pick your way to your preferences" />
        <meta content="https://pickr.lol/og.png" property="twitter:image" />
      </Helmet>
      <Sticky
        // Prevent calculation / jittery bug
        rootTopMarginOffsetPx={collapsedMaxHeightPx + 3}
        onSticky={handleOnToolbarSticky}
      >
        <Spacer>
          <TopicSortOrderSelector
            active={sortOrder}
            onOrderChange={handleTopicSortOrderSelectorChange}
          />
          {tags.length > 0 ? (
            <TagFilterSelector
              tags={tags.filter((t) => t.topicIds.length > 0)}
              activeTagNames={activeTagNames}
              onTagChange={handleTagChange}
              isCollapsed={isToolbarSticky}
            />
          ) : null}
        </Spacer>
      </Sticky>
      <h3>
        Topics (
        <VisibilityContainer key={activeTagNames.length}>
          {topicSummaries.length}
        </VisibilityContainer>
        )
      </h3>
      <TopicsContainer isLTEML={isLTEML}>
        {renderedTopicSummaries.map((s) => {
          const handleClick = () => handleTopicClick(s.id, s.name)
          const handleDelete = () => handleDeleteTopic(s.id)
          const handleEdit = () => handleEditTopic(s.id)
          const handleEditRankScore = (nextScore: number) =>
            handleEditTopicRankScore(s.id, nextScore)
          return (
            <ClickableTopicTile
              key={s.id}
              topicSummary={s}
              onClick={handleClick}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onEditRankScore={handleEditRankScore}
            />
          )
        })}
      </TopicsContainer>
      {renderedTopicSummaries.length === topicSummaries.length ? (
        <EndMessage>
          You've reached the end.
          <br />
          Don't see what you like? <Link to="/new">Create new topic</Link>
        </EndMessage>
      ) : null}
    </Container>
  )
}

const Container = styled.div`
  & > div:not(:last-child) {
    margin-bottom: ${gapUnitPx * 6}px;
  }
`

const Spacer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${gapUnitPx}px;
`

const TopicsContainer = styled.div<{ isLTEML: boolean }>`
  display: grid;

  justify-items: center;
  justify-content: center;

  margin: 0 ${TOPICS_GRID_HORZ_MARGIN_PX}px;

  grid-template-columns: repeat(
    ${TOPICS_DESKTOP_GRID_REPEAT},
    minmax(${MIN_TOPIC_WIDTH_DESKTOP_PX}px, 1fr)
  );

  @media (max-width: ${tabletBreakpointPx}px) {
    grid-template-columns: repeat(1, minmax(100%, ${TILE_TABLET_WIDTH_PX}px));
  }

  grid-auto-rows: ${TOPIC_HEIGHT_PX}px;

  padding-bottom: ${gapUnitPx * 5}px;

  ${(props) =>
    props.isLTEML
      ? `grid-gap: ${TOPICS_GRID_GAP_PX / 2}px;`
      : `grid-gap: ${TOPICS_GRID_GAP_PX}px;`}
`

const EndMessage = styled.div`
  text-align: center;
  margin: ${gapUnitPx * 12}px 0;

  a {
    color: ${backgroundColorAccentPrimary};
  }
`

export default Topics
