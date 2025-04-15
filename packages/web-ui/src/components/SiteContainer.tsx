import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import SiteFooter from './SiteFooter'

const SiteContainer: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  children,
  ...props
}) => (
  <Container {...props}>
    {children} <SiteFooter />
  </Container>
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export default SiteContainer
