import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { backgroundColorSecondary, borderRadiusPx, gapUnitPx } from '../theme'

const NARROW_VIEW_WIDTH_PX = 320
const PADDING = gapUnitPx * 4
export const TOTAL_CONTENT_WIDTH = NARROW_VIEW_WIDTH_PX + PADDING * 2
export interface INarrowViewProps extends ComponentPropsWithoutRef<'div'> {
  centering?: boolean
}

const NarrowView: React.FC<INarrowViewProps> = ({ children, ...props }) => (
  <NarrowViewContainer {...props}>{children}</NarrowViewContainer>
)

const NarrowViewContainer = styled.div<INarrowViewProps>`
  width: ${NARROW_VIEW_WIDTH_PX}px;
  padding: ${PADDING}px;
  margin-bottom: ${PADDING}px;
  border-radius: ${borderRadiusPx}px;

  background-color: ${backgroundColorSecondary};

  ${(props) =>
    props.centering &&
    `
    text-align: center;
  `}

  word-break: break-word;
`

export default NarrowView
