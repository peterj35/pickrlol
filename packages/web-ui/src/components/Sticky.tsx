import { ComponentPropsWithoutRef, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { backgroundColorPrimary, gapUnitPx } from '../theme'

// In order to be intersected as sticky,
const rootTopMarginPx = 1

type StickyProps = {
  rootTopMarginOffsetPx?: number
  onSticky?: (isSticky: boolean) => void
} & ComponentPropsWithoutRef<'div'>

export const Sticky: React.FC<StickyProps> = ({
  rootTopMarginOffsetPx = 0,
  onSticky,
  ...props
}) => {
  const elemRef = useRef<HTMLDivElement>(null)
  const observer = useMemo(
    () =>
      new IntersectionObserver(
        (e) => {
          onSticky?.(!e[0].isIntersecting)
        },
        {
          // See: https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered
          rootMargin: `-${
            rootTopMarginOffsetPx + rootTopMarginPx
          }px 0px 0px 0px`,
          threshold: [1],
        }
      ),
    [onSticky, rootTopMarginOffsetPx]
  )

  useEffect(() => {
    const effectElemRef = elemRef.current

    if (effectElemRef) {
      observer.observe(effectElemRef)
    }

    return () => {
      if (effectElemRef) {
        observer.unobserve(effectElemRef)
      }
    }
  }, [observer])

  return <StickyDiv ref={elemRef} {...props} />
}

export const StickyDiv = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${backgroundColorPrimary};

  padding: ${gapUnitPx * 1}px;
`
