import Button, { IButtonProps } from './Button'
import { useAuth0 } from '@auth0/auth0-react'
import useIsLTEML from '../hooks/useIsLTEML'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

interface ILogoutButtonProps extends IButtonProps {}

const LogoutButton: React.FC<ILogoutButtonProps> = ({ ...props }) => {
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    })
  }

  const isLTEML = useIsLTEML()

  return isLTEML ? (
    <button {...props} onClick={handleLogout}>
      <ExitToAppIcon />
    </button>
  ) : (
    <Button {...props} onClick={handleLogout}>
      Logout
    </Button>
  )
}

export default LogoutButton
