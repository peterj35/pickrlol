import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'

interface IFullScreenCenteringProps extends ComponentPropsWithoutRef<'div'> {}

const FullScreenCentering: React.FC<IFullScreenCenteringProps> = ({
  children,
  ...props
}) => <Container {...props}>{children}</Container>

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default FullScreenCentering
