import Konva from 'konva'
import { Rect } from 'react-konva'
import useImage from 'use-image'

type CanvasImageProps = {
  src: string
  /** Will be ignored if offsetX is defined */
  isCentered?: boolean
} & Omit<Konva.ImageConfig, 'image'>

const CanvasImage: React.FC<CanvasImageProps> = ({
  src,
  width,
  height,
  isCentered = true,
  ...props
}) => {
  // See: https://konvajs.org/docs/posts/Tainted_Canvas.html
  const [image] = useImage(
    // See: https://stackoverflow.com/questions/44865121/canvas-tainted-by-cors-data-and-s3
    `${src}?response-cache-control=no-cache`,
    'anonymous'
  )

  if (!image?.width || !image?.height) {
    return null
  }

  const scaleX = width / image.width
  const scaleY = height / image.height
  const scale = Math.min(scaleX, scaleY)

  const offsetX = (width - image.width * scale) / 2

  return (
    <Rect
      offsetX={isCentered ? -offsetX : undefined}
      {...props}
      width={isCentered ? width - offsetX : width}
      height={height}
      fillPatternImage={image}
      fillPatternScaleX={scale}
      fillPatternScaleY={scale}
      fillPatternRepeat="no-repeat"
    />
  )
}

export default CanvasImage
