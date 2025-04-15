import Button, { IButtonProps } from './Button'
import { useAuth0 } from '@auth0/auth0-react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import useIsLTEML from '../hooks/useIsLTEML'

interface ILoginButtonProps extends IButtonProps {
  isResponsive?: boolean
}

/**
 * @param children if not provided, renders a default copy
 */
const LoginButton: React.FC<ILoginButtonProps> = ({
  isResponsive,
  children,
  ...props
}) => {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect()
  }

  const isLTEML = useIsLTEML()

  return isResponsive && isLTEML ? (
    <button {...props} onClick={handleLogin}>
      <AccountCircleIcon />
    </button>
  ) : (
    <Button {...props} onClick={handleLogin}>
      {children ? children : 'Login'}
    </Button>
  )
}

export default LoginButton
