import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import loadingIcon from '../assets/loading.svg'
import { CenteringContainer } from './CenteringContainer'

interface ILoadingProps extends ComponentPropsWithoutRef<'img'> {}

const Loading: React.FC<ILoadingProps> = ({ ...props }) => {
  return <img src={loadingIcon} alt="loading" {...props}></img>
}

export const LargeLoading = styled(Loading)`
  width: 200px;
  height: 200px;
`

export const TinyLoading = styled(Loading)`
  width: 24px;
  height: 24px;
`

interface ICenteredLoadingProps extends ILoadingProps {
  size?: 'regular' | 'large'
}

export const CenteredLoading: React.FC<ICenteredLoadingProps> = ({
  size = 'regular',
  ...props
}) => (
  <CenteringContainer>
    {size === 'large' ? <LargeLoading {...props} /> : <Loading {...props} />}
  </CenteringContainer>
)

export default Loading
