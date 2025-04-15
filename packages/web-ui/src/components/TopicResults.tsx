import { IChoice } from '@ovo/data-api'
import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import styled from 'styled-components'
import {
  sortByGameResults,
  sortByRoundResultsAccountingGame,
} from '../lib/choice'
import { getMediaUrl } from '../lib/images'
import {
  backgroundColorAccentSecondary,
  backgroundColorPrimary,
  borderRadiusPx,
  ellipsisRules,
  gapUnitPx,
  getGoldenShort,
  getRgba,
  hoverBoxShadow,
  smallFontPx,
  tabletBreakpointPx,
  white,
} from '../theme'
import { CoveringImg } from './Img'
import WinningProportion from './WinningProportion'
import Bold from './Bold'
import { useState } from 'react'
import TopicResultsChoicesModal from './TopicResultsChoicesModal'

const CHOICE_ITEM_WIDTH_PX = 288
const CHOICE_ITEM_HEIGHT_PX = 190
const CHOICE_INFO_OUTER_PADDING_PX = gapUnitPx * 2

export interface ITopicResultsProps extends ComponentPropsWithoutRef<'div'> {
  choices: IChoice[]
  isChoicesModalAllowed: boolean
}

const TopicResults: React.FC<ITopicResultsProps> = ({
  choices,
  isChoicesModalAllowed,
  ...props
}) => {
  const [isChoicesModalVisible, setIsChoicesModalVisible] = useState<boolean>(
    false
  )
  const [choicesModalChoiceId, setChoicesModalChoiceId] = useState<
    string | undefined
  >(undefined)

  const sortedChoices = useMemo(
    () =>
      choices.sort(sortByGameResults).sort(sortByRoundResultsAccountingGame),
    [choices]
  )

  const handleChoiceClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isChoicesModalAllowed) {
      return
    }
    const choiceId = e.currentTarget.id
    if (choiceId) {
      setChoicesModalChoiceId(choiceId)
    }
    setIsChoicesModalVisible(true)
  }

  const handleChoicesModalClose = () => {
    setIsChoicesModalVisible(false)
    setChoicesModalChoiceId(undefined)
  }

  return (
    <TopicResultsContainer {...props}>
      {sortedChoices.map((choice, index) => (
        <Choice
          key={choice.id}
          id={choice.id}
          onClick={handleChoiceClick}
          isClickable={isChoicesModalAllowed}
        >
          <ChoiceMediaContainer>
            <ChoiceRankContainer>
              <ChoiceRank>{index + 1}.</ChoiceRank>
            </ChoiceRankContainer>
            <CoveringImgWithBRadius src={getMediaUrl(choice.mediaSrc)} />
          </ChoiceMediaContainer>
          <ChoiceInfo>
            <ChoiceName title={choice.name}>
              <Bold>{choice.name}</Bold>
            </ChoiceName>
            <WinningProportion
              winCount={choice.record.totalWinCount}
              totalCount={choice.record.gamesPlayedCount}
              type="games"
            />
            <WinningProportion
              winCount={choice.record.roundsWinCount}
              totalCount={choice.record.roundsPlayedCount}
              type="rounds"
            />
          </ChoiceInfo>
        </Choice>
      ))}
      <TopicResultsChoicesModal
        open={isChoicesModalVisible}
        onClose={handleChoicesModalClose}
        choices={sortedChoices}
        activeChoiceId={choicesModalChoiceId}
      />
    </TopicResultsContainer>
  )
}

const TopicResultsContainer = styled.div`
  display: grid;
  grid-template-columns: ${CHOICE_ITEM_WIDTH_PX}px;
  grid-auto-rows: ${CHOICE_ITEM_HEIGHT_PX}px;
  grid-gap: ${gapUnitPx * 8}px;
  background-color: ${backgroundColorPrimary};
`

const Choice = styled.div<{ isClickable: boolean }>`
  display: grid;
  grid-auto-flow: column;
  background-color: ${white};
  grid-gap: ${gapUnitPx}px;
  border-radius: ${borderRadiusPx}px;

  @media (min-width: ${tabletBreakpointPx}px) {
    :hover {
      box-shadow: ${hoverBoxShadow};
      transform: scale(1.5);
      z-index: 1;
      cursor: crosshair;

      ${({ isClickable }) =>
        isClickable &&
        `
        cursor: pointer;
      `}
    }

    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
  }
`

const ChoiceMediaContainer = styled.div`
  width: ${CHOICE_ITEM_WIDTH_PX - getGoldenShort(CHOICE_ITEM_WIDTH_PX)}px;
  position: relative;
`

const ChoiceRankContainer = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: ${CHOICE_ITEM_HEIGHT_PX - getGoldenShort(CHOICE_ITEM_HEIGHT_PX)}px;
  background-color: ${getRgba(backgroundColorAccentSecondary, 0.9)};
  border-bottom-left-radius: ${borderRadiusPx}px;

  display: flex;
  align-items: center;
`

const CoveringImgWithBRadius = styled(CoveringImg)`
  border-top-left-radius: ${borderRadiusPx}px;
  border-bottom-left-radius: ${borderRadiusPx}px;

  height: ${CHOICE_ITEM_HEIGHT_PX}px;
`

const ChoiceRank = styled.div`
  color: ${white};
  font-weight: 700;
  padding-left: ${gapUnitPx * 2}px;
`

const ChoiceInfo = styled.div`
  width: ${getGoldenShort(CHOICE_ITEM_WIDTH_PX) -
  gapUnitPx -
  CHOICE_INFO_OUTER_PADDING_PX * 2}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${CHOICE_INFO_OUTER_PADDING_PX}px;
`

const ChoiceName = styled.div`
  font-size: ${smallFontPx}px;
  ${ellipsisRules}
`

export default TopicResults
