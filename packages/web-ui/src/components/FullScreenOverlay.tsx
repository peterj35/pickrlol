import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import {
  gapUnitPx,
  darkGrey,
  white,
  tabletBreakpointPx,
  getRgba,
  grey,
} from '../theme'
import { WhiteClickableIcon } from './ClickableIcon'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import useNoBodyScroll from '../hooks/useNoBodyScroll'

export type FullScreenOverlayProps = {
  isVisible: boolean
  hasTransition?: boolean
  onClose?: () => void
} & ComponentPropsWithoutRef<'div'>

const FullScreenOverlay: React.FC<FullScreenOverlayProps> = ({
  children,
  isVisible,
  hasTransition = true,
  onClose,
  ...props
}) => {
  useNoBodyScroll(isVisible)

  return (
    <FSOverlay isVisible={isVisible} hasTransition={hasTransition} {...props}>
      <OverlayContent>
        {onClose ? (
          <PositionedClickableIcon onClick={onClose}>
            <ArrowBackIcon fontSize="large" />
          </PositionedClickableIcon>
        ) : null}
        {children}
      </OverlayContent>
    </FSOverlay>
  )
}

const FSOverlay = styled.div<{ isVisible: boolean; hasTransition: boolean }>`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  ${({ isVisible }) =>
    !isVisible
      ? `
    opacity: 0;
    pointer-events: none;
  `
      : `
    opacity: 1;
  `}

  color: ${white};
  background-color: ${darkGrey};
  transition: opacity ${({ hasTransition }) => (hasTransition ? `0.2s` : `0`)}
    ease-out;
`

const OverlayContent = styled.div`
  position: relative;
`

const PositionedClickableIcon = styled(WhiteClickableIcon)`
  position: absolute;
  top: ${gapUnitPx * 2}px;
  left: ${gapUnitPx * 2}px;

  background-color: ${getRgba(grey, 0.8)};
  border-radius: 8px;

  @media (max-width: ${tabletBreakpointPx}px) {
    top: ${gapUnitPx * 2}px;
    left: ${gapUnitPx * 2}px;
  }

  height: 35px;

  cursor: pointer;
`

export default FullScreenOverlay
