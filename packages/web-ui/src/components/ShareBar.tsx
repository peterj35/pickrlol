import React, { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import CopyToClipboardButton from './CopyToClipboardButton'

const Sharebar: React.FC<ComponentPropsWithoutRef<'div'>> = ({ ...props }) => (
  <Container {...props}>
    <CopyToClipboardButton text={document.location.href} />
  </Container>
)

const Container = styled.div``

export default Sharebar
