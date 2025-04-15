import {
  Button,
  Dialog,
  DialogProps,
  makeStyles,
  MobileStepper,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core'
import { IChoice } from '@ovo/data-api'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { useState } from 'react'
import { getMediaUrl } from '../lib/images'
import { useEffect } from 'react'
import styled from 'styled-components'
import { bindKeyboard } from 'react-swipeable-views-utils'

const KeyboardBoundSwipeableViews = bindKeyboard(SwipeableViews)

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1200,
    flexGrow: 1,
    display: 'grid',
    gridTemplateRows: 'auto 60vh auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: theme.palette.background.default,
  },
  view: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  img: {
    display: 'block',
    overflow: 'hidden',
    objectFit: 'contain',
  },
}))

interface ITopicResultsChoicesModal extends DialogProps {
  choices: IChoice[]
  activeChoiceId?: string
}

const TopicResultsChoicesModal: React.FC<ITopicResultsChoicesModal> = ({
  choices,
  activeChoiceId,
  ...props
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const [activeStep, setActiveStep] = useState<number>(0)
  const maxSteps = choices.length

  useEffect(() => {
    if (activeChoiceId) {
      const stepIndex = choices.findIndex((c) => c.id === activeChoiceId)
      setActiveStep(stepIndex)
    }
  }, [activeChoiceId, choices])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  return (
    <Dialog maxWidth={false} {...props}>
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.header}>
          <CenteredSlideHeader>{choices[activeStep].name}</CenteredSlideHeader>
        </Paper>
        <KeyboardBoundSwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          slideStyle={{
            display: 'flex',
            alignSelf: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          containerStyle={{
            height: '100%',
          }}
        >
          {choices.map((choice, index) => (
            <div key={choice.id} className={classes.view}>
              {Math.abs(activeStep - index) <= 2 ? (
                <img
                  className={classes.img}
                  src={getMediaUrl(choice.mediaSrc)}
                  alt={choice.name}
                />
              ) : null}
            </div>
          ))}
        </KeyboardBoundSwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
    </Dialog>
  )
}

const CenteredSlideHeader = styled(Typography)`
  text-align: center;
`

export default TopicResultsChoicesModal
