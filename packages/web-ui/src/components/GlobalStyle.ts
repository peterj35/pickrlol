import { createGlobalStyle } from 'styled-components'
import { backgroundColorPrimary, gapUnitPx } from '../theme'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${backgroundColorPrimary};
    font-family: 'Quicksand', Open-Sans, Helvetica, Sans-Serif;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  li {
    margin-bottom: ${gapUnitPx * 2}px;
  }

  button {
    all: unset;
    cursor: pointer;
  }
`

export default GlobalStyle
