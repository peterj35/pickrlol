import {
  AccordionProps,
  Accordion as MuiAccordian,
  AccordionSummary,
  AccordionDetails,
  withStyles,
} from '@material-ui/core'
import React from 'react'
import TopicResults, { ITopicResultsProps } from './TopicResults'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { backgroundColorPrimary, hoverBoxShadow } from '../theme'
import { gapUnitPx, grey, getRgba, borderRadiusPx } from '../theme'
import styled from 'styled-components'

interface ITopicResultsAccordionProps extends Partial<AccordionProps> {
  topicResultsProps: ITopicResultsProps
}

const Accordion = withStyles(
  {
    root: {
      backgroundColor: backgroundColorPrimary,
      boxShadow: 'none',
      border: `2px solid ${getRgba(grey, 0.4)}`,
      transition: 'box-shadow 0.2s ease-out',
      borderRadius: borderRadiusPx,
      '&:hover': {
        boxShadow: hoverBoxShadow,
      },
    },
  },
  { withTheme: true }
)(MuiAccordian)

const TopicResultsAccordion: React.FC<ITopicResultsAccordionProps> = ({
  topicResultsProps,
  ...props
}) => {
  return (
    <Accordion {...props}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div>Results</div>
      </AccordionSummary>
      <AccordionDetails>
        <TopicResults {...topicResultsProps} />
      </AccordionDetails>
    </Accordion>
  )
}

export const TopicResultsAccordionWithMargin = styled(TopicResultsAccordion)`
  margin-top: ${gapUnitPx * 4}px;
`

export default TopicResultsAccordion
