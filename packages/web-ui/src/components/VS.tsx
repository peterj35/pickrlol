import { ComponentPropsWithoutRef } from 'react'
import versus from '../assets/VS.svg'

interface IVSProps extends ComponentPropsWithoutRef<'img'> {}

const VS: React.FC<IVSProps> = ({ ...props }) => (
  <img alt="vs" {...props} src={versus} />
)

export default VS
