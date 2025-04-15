import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { backgroundColorAccentSecondary, gapUnitPx, white } from '../theme'

interface IClickableIconProps extends ComponentPropsWithoutRef<'div'> {}

const ClickableIcon: React.FC<IClickableIconProps> = ({
  children,
  ...props
}) => <IconContainer {...props}>{children}</IconContainer>

const IconContainer = styled.div`
  display: flex;
  text-align: center;

  background-color: transparent;

  cursor: pointer;
  user-select: none;

  padding: ${gapUnitPx}px ${gapUnitPx}px;

  :hover {
    color: ${backgroundColorAccentSecondary};
  }

  transition: color 0.2s ease-out;
`

export const WhiteClickableIcon = styled(ClickableIcon)`
  color: ${white};
`

export default ClickableIcon
