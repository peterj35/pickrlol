import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { boldFontWidth } from '../theme'

interface IBoldProps extends ComponentPropsWithoutRef<'span'> {}

const Bold: React.FC<IBoldProps> = ({ children, ...props }) => (
  <BoldSpan {...props}>{children}</BoldSpan>
)

const BoldSpan = styled.span`
  font-weight: ${boldFontWidth};
`

export default Bold
