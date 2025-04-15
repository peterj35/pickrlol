import { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { useScrollPageToTopOnNavigation } from '../hooks/useScrollPageToTopOnNavigation'
import { smallerFontPx } from '../theme'
import NarrowView from './NarrowView'

const markdown = `
# Disclaimer

The information contained in this website is for general information purposes only. The information is provided by OVSO Entertainment Inc. ("OVSO") and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.

Through this website you are able to link to other websites which are not under the control of OVSO. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.

Every effort is made to keep the website up and running smoothly. However, OVSO takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.

Data relevant to the website may be altered without any notice.

---

# Inappropriate Content

The site is regularly monitored for quality assurance. Adult content is strictly
forbidden and removed without any notice.
`

const Disclaimer: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  ...props
}) => {
  useScrollPageToTopOnNavigation()

  return (
    <Container {...props}>
      <ReactMarkdown children={markdown} />
    </Container>
  )
}

const Container = styled(NarrowView)`
  font-size: ${smallerFontPx}px;
`

export default Disclaimer
