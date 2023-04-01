import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import SkipNextIcon from '@material-ui/icons/SkipNextRounded';
import SkipPreviousIcon from '@material-ui/icons/SkipPreviousRounded';
import PreviousIcon from '@material-ui/icons/ArrowBackRounded';
import NextIcon from '@material-ui/icons/ArrowForwardRounded';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  button: {
    minWidth: 30,
    minHeight: 30,
    marginRight: 5,
  },
  speedSelect: {
    color: theme.palette.primary.contrastText,
  }
}))

const ButtonControlGroup = (props) => {
  const classes = useStyles()
  const { isPlaying, slowDownRate, handleSkipFrame, handleClickPlay, handleClickPause, setPlayingState } = props
  console.log(slowDownRate)
  return (
    <Grid container item xs={4} className={classes.root}>
      <FormControl
        variant="outlined" size="small" color="primary"
        className={classes.speedSelect}
      >
        <InputLabel id="select-play-speed-label">Speed</InputLabel>
        <Select
          labelId="select-play-speed-label"
          id="select-speed"
          value={slowDownRate}
          onChange={(e) => setPlayingState({ slowDownRate: e.target.value })}
          label="Speed"
          size="small"
        >
          <MenuItem value={1.5}>1.5</MenuItem>
          <MenuItem value={1.25}>1.25</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={0.75}>0.75</MenuItem>
          <MenuItem value={0.5}>0.5</MenuItem>
        </Select>
      </FormControl>
      <Button size="small" color="secondary" onClick={handleSkipFrame(-10)} className={classes.button}>
        <SkipPreviousIcon fontSize="small" />
      </Button>
      <Button size="small" color="secondary" onClick={handleSkipFrame(-1)} className={classes.button}>
        <PreviousIcon fontSize="small" />
      </Button>
      {!isPlaying ?
        <Button size="small" color="secondary" onClick={handleClickPlay} className={classes.button}>
          <PlayIcon fontSize="small" />
        </Button>
        :
        <Button size="small" color="secondary" onClick={handleClickPause} className={classes.button}>
          <PauseIcon fontSize="small" />
        </Button>
      }
      <Button size="small" color="secondary" onClick={handleSkipFrame(1)} className={classes.button}>
        <NextIcon fontSize="small" />
      </Button>
      <Button size="small" color="secondary" onClick={handleSkipFrame(10)} className={classes.button}>
        <SkipNextIcon fontSize="small" />
      </Button>
    </Grid>
  )
}

export default ButtonControlGroup