import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { borderRadiusPx } from '../theme'

interface IImageProps extends ComponentPropsWithoutRef<'img'> {}

/**
 * Note: this component is not called 'Image' as that is a reserved global var
 */
const Img: React.FC<IImageProps> = ({ ...props }) => (
  <ImageElem alt="" {...props} />
)

const ImageElem = styled.img`
  max-width: 100%;
`

export const ImageWithBorderRadius = styled(Img)`
  border-radius: ${borderRadiusPx}px;
`

interface CoveringImgProps extends ComponentPropsWithoutRef<'div'> {
  src: string
}

export const CoveringImg: React.FC<CoveringImgProps> = ({ src, ...props }) => {
  return <CoveringImgNode {...props} src={src} />
}

const CoveringImgNode = styled.img<{ src: string }>`
  background-image: url('${({ src }) => src}');
  object-fit: cover;

  width: 100%;
  height: 100%;
`

export default Img
