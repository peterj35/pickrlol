import { Tooltip } from '@material-ui/core'
import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import {
  backgroundColorAccentPrimary,
  backgroundColorAccentSecondary,
  borderRadiusPx,
  gapUnitPx,
  mediumFontPx,
  white,
  hoverBoxShadow,
  hoverBoxShadowTransitionRule,
  backgroundHoverTransition,
  lightGrey,
  smallFontPx,
  backgroundColorAccentTertiary,
} from '../theme'

type ButtonState = 'disabled' | 'wait'

export interface IButtonProps extends ComponentPropsWithoutRef<'button'> {
  state?: ButtonState
  /**
   * If provided, displays a tooltip with the message provided.
   * State prop must be defined, to be displayed
   */
  stateMsg?: string
}

const Button: React.FC<IButtonProps> = ({
  state,
  stateMsg,
  children,
  onClick,
  ...props
}) =>
  state ? (
    stateMsg ? (
      <Tooltip title={stateMsg}>
        {state === 'disabled' ? (
          <ButtonDisabled {...props}>{children}</ButtonDisabled>
        ) : (
          <ButtonWaiting {...props}>{children}</ButtonWaiting>
        )}
      </Tooltip>
    ) : (
      <ButtonDisabled {...props}>{children}</ButtonDisabled>
    )
  ) : (
    <ButtonContainer onClick={onClick} {...props}>
      {children}
    </ButtonContainer>
  )

const ButtonContainer = styled.button`
  text-align: center;

  background-color: ${backgroundColorAccentPrimary};
  color: ${white};

  cursor: pointer;
  user-select: none;

  font-size: ${mediumFontPx}px;
  padding: ${gapUnitPx * 2.5}px ${gapUnitPx * 4}px;
  border-radius: ${borderRadiusPx}px;

  :hover {
    box-shadow: ${hoverBoxShadow};
  }

  transition: ${hoverBoxShadowTransitionRule};
`

const ButtonDisabled = styled(ButtonContainer)`
  background-color: ${white};
  cursor: not-allowed;
  border: 1px solid ${backgroundColorAccentPrimary};
  color: ${backgroundColorAccentPrimary};

  :hover {
    background-color: ${lightGrey};
  }

  transition: ${backgroundHoverTransition};
`

const ButtonWaiting = styled(ButtonDisabled)`
  cursor: wait;
`

export const SecondaryButton = styled(Button)`
  background-color: ${backgroundColorAccentSecondary};
`

export const TertiaryButton = styled(Button)`
  background-color: ${backgroundColorAccentTertiary};
`

export const ButtonWithTopMargin = styled(Button)`
  margin-top: ${gapUnitPx * 4}px;
`

export const ButtonWithThickPadding = styled(Button)`
  padding: ${gapUnitPx * 2}px ${gapUnitPx * 4}px ${gapUnitPx * 2}px;
`

export const SmallButton = styled(Button)`
  font-size: ${smallFontPx}px;
`

export const SmallSecondaryButton = styled(SecondaryButton)`
  font-size: ${smallFontPx}px;
`

export const SmallTertiaryButton = styled(TertiaryButton)`
  font-size: ${smallFontPx}px;
`

export default Button
