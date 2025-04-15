import React from 'react'
import styled from 'styled-components'
import { gapUnitPx, hoverBoxShadow, largeFontPx, mediumFontPx, tabletBreakpointPx } from '../theme'
import Bold from './Bold'
import { ImageWithBorderRadius } from './Img'

interface IChoiceShowcaseProps {
  name: string
  mediaSrc: string
  label?: string
}

const ChoiceShowcase: React.FC<IChoiceShowcaseProps> = ({
  name,
  mediaSrc,
  label = 'You chose',
  children,
  ...props
}) => {
  return (
    <ShowcaseContainer {...props}>
      <Label>{label}</Label>
      <HoverableImageWithBorderRadius src={mediaSrc} />
      <NameContainer>
        <Bold>{name}</Bold>
      </NameContainer>

      <Children>{children}</Children>
    </ShowcaseContainer>
  )
}

const NameContainer = styled.div`
  font-size: ${largeFontPx}px;
`

const Children = styled.div`
  margin-top: ${gapUnitPx * 4}px;
`

const ShowcaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.div`
  font-size: ${mediumFontPx}px;
`

const HoverableImageWithBorderRadius = styled(ImageWithBorderRadius)`
  @media (min-width: ${tabletBreakpointPx}px) {
    :hover {
      box-shadow: ${hoverBoxShadow};
      transform: scale(1.5);
      cursor: crosshair;
    }

    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
  }
`

export const ChoiceShowcaseWithMargin = styled(ChoiceShowcase)`
  margin: ${gapUnitPx * 12}px 0;
`

export default ChoiceShowcase
