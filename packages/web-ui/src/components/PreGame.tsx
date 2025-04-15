import { Button } from '@material-ui/core'
import React, { useMemo, ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { getMaxPowerOfTwo } from '../lib/game'
import { gapUnitPx } from '../theme'
import { HorizontalButtonContainer } from './ButtonContainer'

interface IPreGameProps extends ComponentPropsWithoutRef<'div'> {
  numChoices: number
  onComplete: (numChoices: number) => void
}

const PreGame: React.FC<IPreGameProps> = ({
  numChoices,
  onComplete,
  ...props
}) => {
  const maxChoices = getMaxPowerOfTwo(numChoices)
  const validChoiceCounts = useMemo(() => {
    const choiceCounts = []

    let choiceCount = maxChoices
    while (choiceCount !== 1) {
      choiceCounts.push(choiceCount)
      choiceCount = choiceCount / 2
    }

    return choiceCounts
  }, [maxChoices])

  return (
    <PreGameContainer {...props}>
      <div>
        <h2>Select the number of choices to play</h2>
        <ul>
          <li>Choices played are chosen at random, based on your selection</li>
          <li>You may play multiple times</li>
        </ul>
      </div>
      <HorizontalButtonContainer>
        {validChoiceCounts.map((choiceCount) => {
          const handleClick = () => {
            onComplete(choiceCount)
          }
          return (
            <Button
              variant="contained"
              size="large"
              key={choiceCount}
              onClick={handleClick}
            >
              {choiceCount}
            </Button>
          )
        })}
      </HorizontalButtonContainer>
    </PreGameContainer>
  )
}

const PreGameContainer = styled.div`
  display: grid;
  height: 100vh;
  align-content: center;
  justify-content: center;

  padding: 0 ${gapUnitPx * 4}px;
`

export default PreGame
