import React, { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { backgroundColorSecondary, gapUnitPx, smallFontPx } from '../theme'
import NewTopicNavButton from './NewTopicNavButton'
import LoginButton from './LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from './LogoutButton'
import Logo from './Logo'
import useIsLTEML from '../hooks/useIsLTEML'

interface IToolbarProps extends ComponentPropsWithoutRef<'div'> {}

const Toolbar: React.FC<IToolbarProps> = ({ ...props }) => {
  const isLTEML = useIsLTEML()
  const { user, isAuthenticated, isLoading } = useAuth0()

  return (
    <ToolbarContainer {...props}>
      <PositionedNewTopicNavButton />
      <Logo />
      <LoginStatus>
        {isLoading ? null : isAuthenticated ? (
          <>
            {isLTEML ? null : (
              <WelcomeText>
                Welcome,
                <br />
                {user.name}
              </WelcomeText>
            )}
            <LogoutButton />
          </>
        ) : (
          <LoginButton isResponsive />
        )}
      </LoginStatus>
    </ToolbarContainer>
  )
}

const ToolbarContainer = styled.div`
  position: relative;
  background-color: ${backgroundColorSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
`

const PositionedNewTopicNavButton = styled(NewTopicNavButton)`
  position: absolute;
  left: ${gapUnitPx * 2}px;
`

const LoginStatus = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${gapUnitPx * 3}px;

  align-items: center;

  position: absolute;
  right: ${gapUnitPx * 2}px;
`

const WelcomeText = styled.span`
  font-size: ${smallFontPx}px;
  text-align: center;
`

export default Toolbar
