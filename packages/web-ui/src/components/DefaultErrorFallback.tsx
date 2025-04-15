import React, { useCallback } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { HorizontalButtonContainer } from './ButtonContainer'
import FullScreenCentering from './FullScreenCentering'

const DefaultErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const navigateHome = useCallback(() => {
    window.location.href = document.location.origin
  }, [])

  return (
    <FullScreenCentering role="alert">
      <p>🍿 Something went wrong 🥤</p>
      <pre>{error.message}</pre>
      <p>Why don't you...</p>
      <HorizontalButtonContainer>
        <button onClick={resetErrorBoundary}>Try again</button>
        <button onClick={navigateHome}>Go home</button>
      </HorizontalButtonContainer>
    </FullScreenCentering>
  )
}

export default DefaultErrorFallback
