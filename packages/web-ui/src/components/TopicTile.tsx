import { ComponentPropsWithoutRef, MouseEvent, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  backgroundColorSecondary,
  goldenLongPercent,
  goldenShortPercent,
  gapUnitPx,
  hoverBoxShadow,
  ellipsisRules,
  smallFontPx,
  hoverBoxShadowTransitionRule,
  getRgba,
  white,
  borderRadiusPx,
  transformTransitionRule,
  opacityTransitionRule,
  grey,
} from '../theme'
import { ITopicSummary } from '@ovo/data-api'
import { getMediaUrl } from '../lib/images'
import ClickableIcon from './ClickableIcon'
import AlertDialog from './AlertDialog'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import { useMatchesCurrentUserId } from '../hooks/useMatchesCurrentUserId'
import axios from 'axios'
import InlineImages from './InlineImages'
import { getIsDev } from '../lib/env'
import { useInView } from 'react-intersection-observer'
import { Transition } from 'react-transition-group'
import { TransitionStatus } from 'react-transition-group/Transition'
import { useGetIsAdminUser } from '../hooks/useGetIsAdminUser'
import { Input } from '@material-ui/core'
import { rankScoreHarshEffectThreshold } from '../lib/topicSummary'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS
/**
 * This doesn't matter as the 'entering' and 'exiting'
 * are styled
 */
const visibilityTransitionTimeoutMs = 0

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

const archiveTopic = async (id: string) => {
  await axios.put(`${API_ENDPOINT_TOPICS}/${id}/archive`)
}

const minTopicPlayedCountForDisplay = 4

interface ITopicTileProps extends ComponentPropsWithoutRef<'div'> {
  topicSummary: ITopicSummary
  onDelete: () => void
  onEdit: () => void
  onEditRankScore: (nextScore: number) => void
}

/**
 * Tile to render a topic summary, fades in when visible
 */
const TopicTile: React.FC<ITopicTileProps> = ({
  topicSummary,
  onDelete,
  onEdit,
  onEditRankScore,
  ...props
}) => {
  const isAdminUser = useGetIsAdminUser()
  const doesMatchCurrentUserId = useMatchesCurrentUserId(topicSummary.creatorId)

  const isEditable = isAdminUser || doesMatchCurrentUserId

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false)

  const [isEditRankScoreOpen, setIsEditRankScoreOpen] = useState<boolean>(false)
  const [rankScoreInputVal, setRankScoreInputVal] = useState<
    string | undefined
  >(topicSummary.rankScore.toString())

  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  })

  const handleEditButtonClick = (event: MouseEvent) => {
    event.stopPropagation()
    onEdit()
  }

  const handleDeleteButtonClick = (event: MouseEvent) => {
    event.stopPropagation()
    setIsDeleteConfirmOpen(true)
  }

  const handleEditRankScoreButtonClick = (event: MouseEvent) => {
    event.stopPropagation()
    setIsEditRankScoreOpen(true)
  }

  const handleRankScoreChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setRankScoreInputVal(event.target.value)
  }

  const handleEditRankScoreCancel = () => {
    setIsEditRankScoreOpen(false)
    setRankScoreInputVal(topicSummary.rankScore.toString())
  }

  const handleEditRankScoreConfirm = async () => {
    const numericRankScoreInputVal = Number(rankScoreInputVal)
    if (!Number.isInteger(numericRankScoreInputVal)) {
      alert('Invalid rank score input! Doing nothing.')
      return
    }
    onEditRankScore(numericRankScoreInputVal)
  }

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false)
  }

  const handleDeleteConfirm = async () => {
    archiveTopic(topicSummary.id)
    onDelete()
  }

  const imgSrcs = useMemo(
    () => topicSummary.topChoiceMediaSrcs.map((src) => getMediaUrl(src)),
    [topicSummary.topChoiceMediaSrcs]
  )

  const isNumPlayedVisible =
    getIsDev() ||
    topicSummary.totalGamesPlayedCount >= minTopicPlayedCountForDisplay

  return (
    <>
      <Transition in={inView} timeout={visibilityTransitionTimeoutMs}>
        {(state: TransitionStatus) => (
          <TopicTileContainer
            style={{
              ...topicTileTransitionStyles[state],
            }}
            {...props}
            ref={inViewRef}
          >
            {isEditable && (
              <TopicButtonArea>
                <ClickableIcon onClick={handleEditButtonClick}>
                  <Edit />
                </ClickableIcon>
                <ClickableIcon onClick={handleDeleteButtonClick}>
                  <Delete />
                </ClickableIcon>
                {isAdminUser && (
                  <ClickableIcon onClick={handleEditRankScoreButtonClick}>
                    <ImportExportIcon />
                  </ClickableIcon>
                )}
              </TopicButtonArea>
            )}
            <InlineImages imgSrcs={imgSrcs} />
            <TopicLabelContainer>
              <div>
                <TopicTitle>{topicSummary.name}</TopicTitle>
                <TopicDescription>{topicSummary.description}</TopicDescription>
              </div>
              <DataContainer>
                <div>
                  {topicSummary.tagNames.map((tag) => (
                    <TagIndicator key={tag}>{tag}</TagIndicator>
                  ))}
                </div>
                <div>
                  {isNumPlayedVisible ? (
                    <NumPlayed>
                      Played{' '}
                      {topicSummary.totalGamesPlayedCount.toLocaleString()}{' '}
                      times
                    </NumPlayed>
                  ) : null}
                  <NumChoices>
                    {topicSummary.totalChoiceCount} total choices
                  </NumChoices>
                </div>
              </DataContainer>
            </TopicLabelContainer>
          </TopicTileContainer>
        )}
      </Transition>
      <AlertDialog
        isVisible={isDeleteConfirmOpen}
        content={`Are you sure you want to delete ${topicSummary.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <AlertDialog
        isVisible={isEditRankScoreOpen}
        content={
          `Edit the rank score for topic: ${topicSummary.name}.` +
          `Valid scores are from 1000 to -1000. A value of ` +
          `${rankScoreHarshEffectThreshold} or below will ` +
          `harshly affect the ranking, even when sorted by createdAt or ` +
          `mostPlayed.`
        }
        onConfirm={handleEditRankScoreConfirm}
        onCancel={handleEditRankScoreCancel}
        confirmText="Submit"
        cancelText="Cancel"
      >
        <div>Current value is:</div>
        <Input
          value={rankScoreInputVal}
          type="number"
          onChange={handleRankScoreChange}
        />
      </AlertDialog>
    </>
  )
}

const TopicLabelContainer = styled.div`
  padding: ${gapUnitPx * 2}px;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TopicButtonArea = styled.div`
  position: absolute;
  top: ${gapUnitPx * 2}px;
  right: ${gapUnitPx * 2}px;

  display: flex;
  background-color: ${getRgba(white, 0.5)};
  border-radius: ${borderRadiusPx}px;
`

const TopicTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  ${ellipsisRules}
`

const TopicDescription = styled.div`
  font-size: ${smallFontPx}px;
  margin-top: ${gapUnitPx}px;
  ${ellipsisRules}
`

const DataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`

const TagIndicator = styled.div`
  color: ${getRgba(grey, 0.5)};
  font-size: ${smallFontPx}px;
  font-weight: 800;
`

const NumPlayed = styled.div`
  font-size: ${smallFontPx}px;
  font-weight: 800;
`

const NumChoices = styled.div`
  font-size: ${smallFontPx}px;
  font-weight: 800;
`

const topicTileEnterStyles: React.CSSProperties = {
  opacity: 1,
}

const topicTileExitStyles: React.CSSProperties = {
  opacity: 0,
}

const topicTileTransitionStyles: Partial<
  Record<TransitionStatus, React.CSSProperties>
> = {
  entering: topicTileEnterStyles,
  entered: topicTileEnterStyles,
  exiting: topicTileExitStyles,
  exited: topicTileExitStyles,
}

const TopicTileContainer = styled.div`
  position: relative;

  cursor: pointer;
  background-color: ${backgroundColorSecondary};
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: ${goldenLongPercent}% ${goldenShortPercent}%;
  grid-template-columns: 100%;
  border-radius: 8px;

  transition: ${opacityTransitionRule};
`

export const ClickableTopicTile = styled(TopicTile)`
  cursor: pointer;

  &:hover {
    box-shadow: ${hoverBoxShadow};
    transform: translateY(-2px);
  }

  transition: ${hoverBoxShadowTransitionRule}, ${transformTransitionRule},
    ${opacityTransitionRule};
`

export default TopicTile
