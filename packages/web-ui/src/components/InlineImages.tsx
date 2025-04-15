import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { borderRadiusPx } from '../theme'
import { CoveringImg } from './Img'

interface IInlineImagesProps extends ComponentPropsWithoutRef<'div'> {
  imgSrcs: string[]
  hasBottomBorderRadius?: boolean
}

const InlineImages: React.FC<IInlineImagesProps> = ({
  imgSrcs,
  hasBottomBorderRadius = false,
  ...props
}) => (
  <Container numImages={imgSrcs.length} {...props}>
    {imgSrcs.map((src) => (
      <InlineImage
        key={src}
        src={src}
        hasBottomBorderRadius={hasBottomBorderRadius}
      />
    ))}
  </Container>
)

const Container = styled.div<{ numImages: number }>`
  display: flex;

  & > * {
    width: ${(props) => 100 / props.numImages}%;
  }
`

const InlineImage = styled(CoveringImg)<{ hasBottomBorderRadius: boolean }>`
  ${(props) =>
    props.hasBottomBorderRadius &&
    `
    &:first-child {
      border-bottom-left-radius: ${borderRadiusPx}px;
    }

    &:last-child {
      border-bottom-right-radius: ${borderRadiusPx}px;
    }
  `}

  &:first-child {
    border-top-left-radius: ${borderRadiusPx}px;
  }

  &:last-child {
    border-top-right-radius: ${borderRadiusPx}px;
  }
`

export default InlineImages
