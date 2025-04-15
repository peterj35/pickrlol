import { useMediaQuery } from 'react-responsive'
import { mobileLandscapeBreakpointPx } from '../theme'

/**
 * @returns boolean which describes if the screen is less than or equal to mobile landscape breakpoint
 */
const useIsLTEML = () => {
  const isLTEML = useMediaQuery({
    query: `(max-width: ${mobileLandscapeBreakpointPx}px)`,
  })

  return isLTEML
}

export default useIsLTEML
