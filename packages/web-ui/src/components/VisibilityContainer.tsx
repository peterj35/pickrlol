import { ComponentPropsWithoutRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

type VisibilityContainerProps = {
  isVisible?: boolean
  key?: string | number
} & ComponentPropsWithoutRef<'div'>

export const VisibilityContainer: React.FC<VisibilityContainerProps> = ({
  isVisible = true,
  key,
  children,
  ...rest
}) => {
  const [props] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: isVisible ? 1 : 0 },
    }),
    [isVisible, key]
  )

  return (
    <animated.span {...rest} style={props}>
      {children}
    </animated.span>
  )
}
