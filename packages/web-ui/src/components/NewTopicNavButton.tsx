import React from 'react'
import { useHistory } from 'react-router-dom'
import useIsLTEML from '../hooks/useIsLTEML'
import Button, { IButtonProps } from './Button'
import AddIcon from '@material-ui/icons/Add'

interface INeWTopicNavButtonProps extends IButtonProps {}

const NeWTopicNavButton: React.FC<INeWTopicNavButtonProps> = ({ ...props }) => {
  const isLTEML = useIsLTEML()
  const history = useHistory()

  const handleLinkClick = () => {
    history.push('/new')
  }

  return isLTEML ? (
    <button {...props} onClick={handleLinkClick}>
      <AddIcon />
    </button>
  ) : (
    <Button {...props} onClick={handleLinkClick}>
      New Topic
    </Button>
  )
}

export default NeWTopicNavButton
