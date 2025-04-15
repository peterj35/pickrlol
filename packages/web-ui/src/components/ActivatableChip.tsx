import styled from 'styled-components'
import Chip from '@material-ui/core/Chip'
import { smallFontPx, backgroundColorAccentPrimary } from '../theme'

export const ActivatableChip = styled(Chip)`
  && {
    font-family: 'Quicksand', Open-Sans, Helvetica, Sans-Serif;
    font-size: ${smallFontPx}px;
  }

  &.MuiChip-colorPrimary,
  &.MuiChip-colorPrimary:hover,
  &.MuiChip-colorPrimary:focus {
    background-color: ${backgroundColorAccentPrimary};
  }
`
