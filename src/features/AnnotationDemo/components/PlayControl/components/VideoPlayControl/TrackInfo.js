import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import ClockIcon from '@material-ui/icons/Schedule';
import moment from 'moment'

import NakedField from '../../../../../../components/NakedField'


const useStyles = makeStyles(theme => ({
  root: {
  },
  group: {
    color: theme.palette.primary.contrastText
  },
  time: {
    marginLeft: 5,
    marginRight: 5,
  },
  frameInputContainer: {
    width: 60,
  },
  frameNumberInput: {
    textAlign: 'center',
    padding: 5,
    marginRight: 5,
    background: theme.palette.primary.light
  }
}))

const FrameInput = (props) => {
  const classes = useStyles()
  const { playingFrame, fps, numFrames, handleGoToFrame } = props

  const [frameValue, setFrameValue] = useState(playingFrame + 1 || 0)

  useEffect(() => {
    setFrameValue(playingFrame + 1 || 0)
  }, [playingFrame])

  const handleChange = (e) => {
    let frame = e.target.value
    frame = Math.min(Math.max(frame, 0), numFrames)

    setFrameValue(frame)
  }

  const handleBlur = () => {
    handleGoToFrame(Math.max(frameValue - 1, 1), true)
  }

  return (
    <Grid container item xs={3} className={classes.root} alignItems="center" justifyContent="space-between" direction="row">
      <Grid container item xs={6} className={classes.group} alignItems="center" justifyContent="flex-end">
        <ClockIcon fontSize="small"/>
        <span className={classes.time}>
          {moment().minute(0).second((playingFrame + 1) / fps).format("m:ss")}
        </span>
        /
        <span className={classes.time}>
          {moment().minute(0).second(numFrames / fps).format("m:ss")}
        </span>
      </Grid>
      <Grid container item xs={6} className={classes.group} alignItems="center" justifyContent="flex-end">
        <div className={classes.frameInputContainer}>
          <NakedField
            value={frameValue}
            size="small"
            type="number"
            onChange={handleChange}
            onBlur={handleBlur}
            inputProps={{
              className: classes.frameNumberInput
            }}
          />
        </div>
        <span>
          / {numFrames}
        </span>
      </Grid>
    </Grid>
  )
}

export default FrameInput