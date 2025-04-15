import { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { smallerFontPx } from '../theme'
import { CenteringContainer } from './CenteringContainer'
import { SmallInlineLink } from './InlineLink'

const currentYear = new Date().getFullYear()

const SiteFooter: React.FC<ComponentPropsWithoutRef<'div'>> = () => (
  <Container>
    <div>
      <Link to="/disclaimer">
        <SmallInlineLink>Disclaimer</SmallInlineLink>
      </Link>
    </div>
    <Copyright>
      <div>&copy;{currentYear} OVSO Entertainment Inc.</div>
      <div>All rights reserved</div>
    </Copyright>
  </Container>
)

const Container = styled(CenteringContainer)`
  display: flex;
  flex-direction: column;

  padding: 24px 0 48px;

  & > div {
    margin-bottom: 12px;
  }
`

const Copyright = styled(CenteringContainer)`
  display: flex;
  flex-direction: column;

  font-size: ${smallerFontPx}px;
`

export default SiteFooter
