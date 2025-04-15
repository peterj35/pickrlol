import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { backgroundColorAccentPrimary, smallerFontPx } from '../theme'

interface ILinkProps extends ComponentPropsWithoutRef<'button'> {}

const InlineLink: React.FC<ILinkProps> = ({ children, ...props }) => (
  <StyledLink {...props}>{children}</StyledLink>
)

const StyledLink = styled.button`
  color: ${backgroundColorAccentPrimary};
`

export const SmallInlineLink = styled(InlineLink)`
  font-size: ${smallerFontPx}px;
`

export default InlineLink
