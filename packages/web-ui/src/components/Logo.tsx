import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { extraLargeFontPx } from '../theme'

const isDynamicSubtextsEnabled = false

const subtexts = [
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls',
  'Tournament Polls (create your own!)',
  'Choose your biases',
  'Express yourself',
  'Start a discussion',
  'Pick your own way',
  'Discover your tastes',
  'Protip: Stream yourself playing this',
  'Share with your friends',
  'Share with your enemies',
  'Share with your family',
  'Interactive polling',
  'Make your own',
  'Share the URLs',
  'GL, HF',
  'Have fun',
  'Share with your fandom',
  'Click me to see all topics',
  'Refine your tastes',
  'Great time killer',
  'Unsullied by sponsorship',
  'With great power comes great responsibility',
  'Stay hydrated',
  'A way to connect',
  'Have confidence',
  'Batteries included',
  'For the whole family',
  'Peak online content',
  'As seen on Reddit',
  'Proudly Web 2.0',
  'Mildly entertaining',
  'Made with love',
  'Quite easy to make your own topic',
  'GDPR compliant',
  'Go with your gut',
  'Use for good',
  'Less is More',
  'Begone, Paradox of Choice!',
  'Discuss anything',
  'Learn what others think',
  'Comment below',
  'Smash that like button',
]

const getRandomSubTextIndex = () => Math.floor(Math.random() * subtexts.length)

const Logo = () => {
  const history = useHistory()
  const [subTextIndex, setSubTextIndex] = useState<number>(
    getRandomSubTextIndex()
  )
  const [isShown, setIsShown] = useState<boolean>(false)

  useEffect(() => {
    return history.listen(() => {
      setSubTextIndex(getRandomSubTextIndex())
    })
  }, [history])

  useEffect(() => {
    if (!isDynamicSubtextsEnabled) {
      return
    }

    const timeout = setInterval(() => {
      setSubTextIndex(getRandomSubTextIndex())
    }, 7000)

    return () => {
      clearInterval(timeout)
    }
  }, [subTextIndex])

  useEffect(() => {
    setIsShown(false)

    const timeout = setTimeout(() => {
      setIsShown(true)
      // Ensure at least there is one render
    }, 500)

    return () => {
      setIsShown(false)
      clearTimeout(timeout)
    }
  }, [subTextIndex])

  return (
    <LogoContainer>
      <Link to="/">
        <MainLogo>Pickr</MainLogo>
        <SubText isShown={isShown}>{subtexts[subTextIndex]}</SubText>
      </Link>
    </LogoContainer>
  )
}

const LogoContainer = styled.div`
  display: flex;
  text-align: center;

  font-weight: bold;
  font-size: ${extraLargeFontPx}px;
`

const MainLogo = styled.h1`
  font-weight: bold;
  font-size: ${extraLargeFontPx}px;
  margin: 0;
  line-height: 28px;
  letter-spacing: -0.5px;
`

const SubText = styled.div<{ isShown: boolean }>`
  font-size: 12px;
  margin-top: 2px;
  ${({ isShown }) =>
    isShown
      ? `
    opacity: 1;
    transition: opacity 0.3s ease-in;
  `
      : `
    opacity: 0;
    transition: opacity 0;
  `}
`

export default Logo
