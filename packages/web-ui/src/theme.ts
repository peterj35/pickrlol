export const white = '#FFFFFF'
export const black = '#000000'
export const grey = '#4F4F4F'
export const lightGrey = '#F2F2F2'
export const darkGrey = '#333333'

export const blue = '#2F80ED'
export const lightBlue = '#2D9CDB'
export const lighterBlue = '#56CCF2'

export const red = '#EB5757'
export const lightRed = '#EF7A7A'
export const lighterRed = '#F39D9D'

export const green = '#6FCF97'

export const backgroundColorPrimary = '#F2F2F2'
export const backgroundColorSecondary = white
export const backgroundColorAccentPrimary = blue
export const backgroundColorAccentSecondary = lightBlue
export const backgroundColorAccentTertiary = grey

export const backgroundHoverTransition = 'background-color 0.2s ease-out'

export const gapUnitPx = 4
export const extraLargeFontPx = 36
export const largeFontPx = 28
export const mediumFontPx = 20
export const smallFontPx = 14
export const smallerFontPx = 10

export const boldFontWidth = 600

export const borderRadiusPx = 8
export const hoverBoxShadow = 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
export const hoverBoxShadowTransitionRule = 'box-shadow 0.2s ease-out'
export const transformTransitionRule = `transform 0.2s ease-out`
export const opacityTransitionRule = `opacity 0.2s ease-out`

export const ellipsisRules = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/**
 * Viewport breakpoints, referenced from webflow
 * see: https://university.webflow.com/lesson/intro-to-breakpoints
 */
export const tabletBreakpointPx = 991
export const mobileLandscapeBreakpointPx = 767
export const mobilePortraitBreakpointPx = 478

/**
 * Constants related to the golden ratio, to be preferred
 * when needing to decide on proportions
 */
const goldenRatioConstant = 1.618
export const getGoldenShort = (long: number) => long / goldenRatioConstant
export const goldenLongPercent = 62
export const goldenShortPercent = 100 - goldenLongPercent

/*
 * Returns a color in rgba(r,g,b,a) format
 * @param hexCode a valid 6 digit hexCode of the color
 * @param opacity a number between 0 - 1
 */
export const getRgba = (hexCode: string, opacity: number): string => {
  const rgbParsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode)

  if (!rgbParsed) {
    throw new Error(`Passed in an invalid hexCode ${hexCode}`)
  }

  if (opacity < 0 || opacity > 1) {
    throw new Error(`Passed in an invalid opacity value ${opacity}`)
  }

  const r = parseInt(rgbParsed[1], 16)
  const g = parseInt(rgbParsed[2], 16)
  const b = parseInt(rgbParsed[3], 16)

  const result = `rgba(${r}, ${g}, ${b}, ${opacity})`

  return result
}
