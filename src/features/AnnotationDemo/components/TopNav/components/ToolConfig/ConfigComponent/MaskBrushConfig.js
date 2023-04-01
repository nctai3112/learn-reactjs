import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput';

import ToolSelector from '../components/ToolSelector'
import ToolConfigPopUpButton from '../components/ToolConfigPopUpButton'
import Slider from '../../../../../../../components/Slider'

import EventCenter from '../../../../../EventCenter'

import { ReactComponent as PositiveScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/positive_scribble.svg'
import { ReactComponent as NegativeScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/negative_scribble.svg'
import { ReactComponent as SizeSliderIcon } from '../../../../../../../static/images/icons/ConfigIcon/size_slider.svg'


import { EVENT_TYPES, SCRIBBLE_TO_MASK_CONSTANTS, SCRIBBLE_TYPES } from '../../../../../constants'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 30,
    background: theme.palette.secondary.main
  },
  optionContainer: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
  },
  sliderContainer: {
    width: 150,
    marginLeft: 20,
  },
  sliderInput: {
    width: 70,
    '& .MuiOutlinedInput-input': {
      padding: 10,
    },
    '& .MuiInputAdornment-positionEnd': {
      marginLeft: 0,
    }
  },
  popUpContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
}))

const maskBrushTools = [
  {
    tool: SCRIBBLE_TYPES.POSITIVE,
    name: 'Positive scribble',
    component: <PositiveScribbleIcon/>
  },
  {
    tool: SCRIBBLE_TYPES.NEGATIVE,
    name: 'Negative scribble',
    component: <NegativeScribbleIcon />
  },
]


const MaskBrushConfig = (props) => {
  const classes = useStyles()
  const { toolConfig, setToolConfig, } = props
  const { scribbleSize } = toolConfig


  useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_POSITIVE_BRUSH]: getSubject(EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_POSITIVE_BRUSH)
        .subscribe({ next: (e) => setToolConfig({ ...toolConfig, scribbleType: SCRIBBLE_TYPES.POSITIVE }) }),
      [EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_NEGATIVE_BRUSH]: getSubject(EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_NEGATIVE_BRUSH)
        .subscribe({ next: (e) => setToolConfig({ ...toolConfig, scribbleType: SCRIBBLE_TYPES.NEGATIVE }) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <ToolSelector
          activeTool={toolConfig.scribbleType}
          toolList={maskBrushTools}
          onSelect={(tool) => setToolConfig({ ...toolConfig, scribbleType: tool })}
        />
        <ToolConfigPopUpButton
          name={'Scribble size'}
          component={<SizeSliderIcon />}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={scribbleSize}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/^0+/, '')
                setToolConfig({ ...toolConfig, scribbleSize: Math.max(Math.min(Number(e.target.value), SCRIBBLE_TO_MASK_CONSTANTS.MAX_SCRIBBLE_SIZE), SCRIBBLE_TO_MASK_CONSTANTS.MIN_SCRIBBLE_SIZE) })
              }}
              className={classes.sliderInput}
              type="number"
            />
            <div className={classes.sliderContainer}>
              <Slider
                value={scribbleSize}
                aria-labelledby="scribble-size-slider"
                step={1}
                min={SCRIBBLE_TO_MASK_CONSTANTS.MIN_SCRIBBLE_SIZE}
                max={SCRIBBLE_TO_MASK_CONSTANTS.MAX_SCRIBBLE_SIZE}
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setToolConfig({ ...toolConfig, scribbleSize: newValue })}
              />
            </div>
          </div>
        </ToolConfigPopUpButton>
      </div>
    </div>
  )
}

export default MaskBrushConfig