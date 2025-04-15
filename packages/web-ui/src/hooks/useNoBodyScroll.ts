import { useRef, useEffect } from 'react'

const useNoBodyScroll = (enabled: boolean) => {
  const lastScrollYPosRef = useRef(0)

  useEffect(() => {
    if (enabled) {
      window.document.body.style.overflow = 'hidden'
      lastScrollYPosRef.current = window.scrollY
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = 'auto'
      window.scrollTo(0, lastScrollYPosRef.current)
    }

    return () => {
      document.body.style.overflow = 'auto'
      if (lastScrollYPosRef.current) {
        window.scrollTo(0, lastScrollYPosRef.current)
      }
    }
  }, [enabled])
}

export default useNoBodyScroll
