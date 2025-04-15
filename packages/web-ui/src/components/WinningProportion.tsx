import React, { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { LinearProgress } from '@material-ui/core'
import {
  backgroundColorAccentPrimary,
  gapUnitPx,
  backgroundColorPrimary,
} from '../theme'
import Bold from './Bold'

interface IWinningProportionProps extends ComponentPropsWithoutRef<'div'> {
  winCount: number
  totalCount: number
  type: string
}

const WinningProportion: React.FC<IWinningProportionProps> = ({
  winCount,
  totalCount,
  type,
  ...props
}) => {
  const percentage = Math.round((winCount / totalCount) * 10000) / 100 || 0

  return (
    <WinningProportionContainer {...props}>
      <Label>
        Won <Bold>{winCount}</Bold> out of <Bold>{totalCount}</Bold> total{' '}
        {type}
      </Label>
      <Bar>
        <StyledLinearProgress variant="determinate" value={percentage} />
      </Bar>
      <Percentage>
        <Bold>{percentage}%</Bold>
      </Percentage>
    </WinningProportionContainer>
  )
}

const StyledLinearProgress = styled(LinearProgress)`
  background-color: ${backgroundColorPrimary} !important;

  > * {
    &:first-child {
      background-color: ${backgroundColorAccentPrimary};
    }
  }
`

const WinningProportionContainer = styled.div`
  display: grid;
  grid-template-areas:
    'label   label     '
    'bar     percentage';
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 70% 30%;
  grid-column-gap: ${gapUnitPx * 2}px;

  font-size: 12px;
`

const Label = styled.div`
  grid-area: label;
`

const Bar = styled.div`
  grid-area: bar;

  display: flex;
  flex-direction: column;
  align-self: center;
`

const Percentage = styled.div`
  grid-area: percentage;
`

export default WinningProportion
