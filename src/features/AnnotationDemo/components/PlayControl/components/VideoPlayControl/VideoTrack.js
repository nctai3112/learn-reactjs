import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {

  },
}))


const VideoTrack = (props) => {
  const classes = useStyles()
  const { playingFrame, numFrames, handleGoToFrame } = props

  const [currentFrame, setCurrentFrame] = useState(playingFrame || 0)
  useEffect(() => {
    setCurrentFrame(playingFrame || 0)
  }, [playingFrame])


  const handleChange = (_, frame) => {
    setCurrentFrame(frame - 1)
  }

  const handleChangeCommitted = (_, frame) => {
    handleGoToFrame(frame - 1, true)
  }

  return (
    <Grid container item xs={5} className={classes.root} alignItems="center">
      <Slider
        value={currentFrame + 1}
        min={1}
        max={numFrames}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        color="secondary"
      />
    </Grid>
  )
}

export default VideoTrack