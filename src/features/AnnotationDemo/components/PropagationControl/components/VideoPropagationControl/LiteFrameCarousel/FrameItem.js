import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'

import './index.css'

const useStyles = makeStyles(theme => ({
  frameItem: {
    height: 60,
    width: 50,
    paddingLeft: 5,
    paddingRight: 5,
  },
  activeFrameItem: {

  },
  frameIndex: {
    fontSize: 12,
    marginBottom: 5,
    cursor: 'pointer',
    '-webkit-user-select': 'none',  /* Chrome all / Safari all */
    '-moz-user-select': 'none',     /* Firefox all */
    '-ms-user-select': 'none',      /* IE 10+ */
    'user-select': 'none'          /* Likely future */
  },
  activeFrameIndex: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  annotationIndicator: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    borderRadius: 5,
    width: '100%',
    height: 25,
    background: theme.palette.secondary.lighter,
    '&:hover': {
      background: theme.palette.primary.main,
    }
  },
  activeAnnotationIndicator: {
    border: '3px solid',
    borderColor: theme.palette.primary.main,
  },
  existAnnotationIndicator: {
    background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.primary.light},
        ${theme.palette.primary.light} 5px,
        ${theme.palette.primary.dark} 5px,
        ${theme.palette.primary.dark} 10px
      )`,
    '&:hover': {
      background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.primary.light},
        ${theme.palette.primary.light} 5px,
        ${theme.palette.primary.darker} 5px,
        ${theme.palette.primary.darker} 10px
      )`,
    }
  },
  keyFrameAnnotationIndicator: {
    background: theme.palette.primary.dark,
    '&:hover': {
      background: theme.palette.primary.main,
    }
  },
  propagatingFrameIndicator: {
    background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.secondary.light},
        ${theme.palette.secondary.light} 5px,
        ${theme.palette.secondary.dark} 5px,
        ${theme.palette.secondary.dark} 10px
      )`,
    '&:hover': {
      background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.secondary.light},
        ${theme.palette.secondary.light} 5px,
        ${theme.palette.secondary.darker} 5px,
        ${theme.palette.secondary.darker} 10px
      )`,
    },
    'animation-name': 'FadeIn',
    'animation-duration': '2s',
    'animation-fill-mode': 'forwards',
    'animation-iteration-count': 'infinite'
  }
}))


const FrameItem = (props) => {
  const classes = useStyles()
  const { index, isActive, annotation, className, ...others } = props

  const isKeyFrame = !!annotation?.keyFrame
  const hasAnnotation = !!annotation

  return (
    <Grid container direction="column" alignItems="center" justifyContent="space-evenly"
      className={clsx(classes.frameItem, isActive && classes.activeFrameItem, className)}
      {...others}
    >
      <Grid item className={clsx(classes.frameIndex, isActive && classes.activeFrameIndex)}>
        {index + 1}
      </Grid>
      <Grid item
        className={clsx(
          classes.annotationIndicator,
          isActive && classes.activeAnnotationIndicator,
          hasAnnotation && classes.existAnnotationIndicator,
          annotation?.isPropagating && classes.propagatingFrameIndicator,
          isKeyFrame && classes.keyFrameAnnotationIndicator,
        )}
      >
      </Grid>
    </Grid>
  )
}

export default FrameItem
