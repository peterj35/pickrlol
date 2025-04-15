import { TextField } from '@material-ui/core'
import { IChoice } from '@ovo/data-api'
import React, { ComponentPropsWithoutRef, useCallback } from 'react'
import styled from 'styled-components'
import { black, gapUnitPx, getRgba, red, white } from '../../theme'
import Cancel from '@material-ui/icons/Cancel'
import WhiteClickableIcon from '../ClickableIcon'
import Img from '../Img'
import { getMediaUrl } from '../../lib/images'

interface IChoicePreviewTileProps extends ComponentPropsWithoutRef<'div'> {
  choice: IChoice
  onNameChange: (val: string) => void
  onDeleteImage: () => void
  canRemove: boolean
  hasError?: boolean
}

const ChoicePreviewTile = ({
  onNameChange,
  choice,
  onDeleteImage,
  canRemove,
  hasError,
  ...props
}: IChoicePreviewTileProps) => {
  const { mediaSrc, name } = choice

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onNameChange(e.target.value)
    },
    [onNameChange]
  )

  return (
    <Tile {...props}>
      {canRemove && (
        <RemoveIconButton onClick={onDeleteImage}>
          <Cancel />
        </RemoveIconButton>
      )}
      <ImageContainer>
        <Img src={getMediaUrl(mediaSrc)} loading="lazy" />
      </ImageContainer>
      <NameArea>
        <StyledTextField
          hasError={hasError}
          variant="filled"
          color="secondary"
          placeholder="Choice title..."
          value={name}
          onChange={handleNameChange}
          error={hasError}
        />
      </NameArea>
    </Tile>
  )
}

const RemoveIconButton = styled(WhiteClickableIcon)`
  position: absolute;
  padding: 0px;
  right: 0px;
  color: ${white};
  z-index: 1;
`

const Tile = styled.div`
  position: relative;
  background-color: ${black};
`

const NameArea = styled.div`
  position: absolute;
  bottom: ${gapUnitPx}px;
  z-index: 1;
`

const StyledTextField = styled(TextField)<{ hasError?: boolean }>`
  color: white;
  background-color: ${getRgba(white, 0.8)};
  padding-top: ${gapUnitPx * 4}px;

  ${({ hasError }) =>
    hasError &&
    `
    border: 3px solid ${red} !important;
  `}
`

const ImageContainer = styled.div`
  display: grid;
  height: 100%;
  align-items: center;
`

export default ChoicePreviewTile
