import React, { ComponentPropsWithoutRef } from 'react'
import { SmallSecondaryButton } from './Button'
import styled from 'styled-components'
import { gapUnitPx } from '../theme'
import { VerticalButtonContainer } from './ButtonContainer'
import { Link } from 'react-router-dom'

const defaultHeaderText = "While you're here..."

interface IOtherTopicsCTAProps extends ComponentPropsWithoutRef<'div'> {
  headerText?: string
}

const OtherTopicsCta: React.FC<IOtherTopicsCTAProps> = ({
  headerText = defaultHeaderText,
  ...props
}) => {
  return (
    <Container {...props}>
      <h3>{headerText}</h3>
      <VerticalButtonContainer>
        <Link to="/new">
          <StaticWidthButton>Make a new topic</StaticWidthButton>
        </Link>
        <Link to="/">
          <StaticWidthButton>See all topics</StaticWidthButton>
        </Link>
      </VerticalButtonContainer>
    </Container>
  )
}

const Container = styled.div`
  margin: ${gapUnitPx * 4}px 0 ${gapUnitPx * 16}px;
  padding: ${gapUnitPx * 2}px;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const StaticWidthButton = styled(SmallSecondaryButton)`
  width: 200px;
`

export default OtherTopicsCta
