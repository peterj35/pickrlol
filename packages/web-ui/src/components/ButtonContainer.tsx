import styled from 'styled-components'
import { gapUnitPx } from '../theme'

const ButtonContainer = styled.div`
  display: grid;
  grid-gap: ${gapUnitPx * 2}px;
`

const HorizontalButtonContainer = styled(ButtonContainer)`
  grid-auto-flow: column;
`

const VerticalButtonContainer = styled(ButtonContainer)`
  grid-auto-flow: row;
  grid-template-columns: min-content;
`

export { HorizontalButtonContainer, VerticalButtonContainer }
