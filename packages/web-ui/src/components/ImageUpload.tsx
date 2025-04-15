import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import ImageIcon from '@material-ui/icons/Image'
import Button from './Button'
interface IImageUploadProps extends ComponentPropsWithoutRef<'input'> {}

const ImageUpload = ({ ...props }: IImageUploadProps) => (
  <Button>
    <CenteredInlineContent>
      <ImageIcon /> Upload Images
      <HiddenImageUploader
        {...props}
        type="file"
        accept="image/x-png,image/gif,image/jpeg,image/webp"
      />
    </CenteredInlineContent>
  </Button>
)

const CenteredInlineContent = styled.span`
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
`

const HiddenImageUploader = styled.input`
  opacity: 0;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
`

export default ImageUpload
