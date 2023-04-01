import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'

import { PROPAGATION_DIRECTION } from '../../../../../constants'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    width: 200,
  },
  directionSelect: {
    color: theme.palette.primary.contrastText,
  },
}));


const PopoverConfig = (props) => {
  const classes = useStyles()
  const { anchorEl, setAnchorEl, propagationConfig, setPropagationConfig, maxValue } = props

  const open = Boolean(anchorEl);

  const handleChange = (e) => {
    const { value, name } = e.target
    setPropagationConfig(current => ({
      ...current,
      [name]: value
    }))
  }

  const handleChangeNumber = ({ name, value}) => {
    setPropagationConfig(current => ({
      ...current,
      [name]: value
    }))
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <FormControl
            variant="outlined" size="small" color="primary"
            fullWidth
            className={classes.directionSelect}
          >
            <InputLabel id="select-direction-label">Direction</InputLabel>
            <Select
              labelId="select-direction-label"
              id="select-direction"
              value={propagationConfig.direction}
              name="direction"
              onChange={handleChange}
              label="Direction"
              size="small"
            >
              <MenuItem value={PROPAGATION_DIRECTION.FORWARD}>Forward</MenuItem>
              <MenuItem value={PROPAGATION_DIRECTION.BACKWARD}>Backward</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.margin}
            variant="outlined"
            color="primary"
            label="Frames"
            size="small"
            type={"number"}
            name="frames"
            fullWidth
            inputProps={{
              min: "0",
              max: String(maxValue)
            }}
            value={Math.min(propagationConfig.frames, maxValue)}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/^0+/, '')
              handleChangeNumber({ name: e.target.name, value: Math.min(e.target.value !== "" ? Number.parseInt(e.target.value) : 0, maxValue) })
            }}
          />
        </Grid>
      </Grid>
    </Popover>
  )
}

export default PopoverConfig