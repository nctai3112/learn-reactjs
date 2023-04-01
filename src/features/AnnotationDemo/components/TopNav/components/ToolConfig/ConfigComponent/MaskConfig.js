import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { debounce } from 'lodash'

import EventCenter from '../../../../../EventCenter'

import ToolSelector from '../components/ToolSelector'
import ToolConfigPopUpButton from '../components/ToolConfigPopUpButton'
import ToolConfigButton from '../components/ToolConfigButton'
import Slider from '../../../../../../../components/Slider'

import { ReactComponent as PositiveScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/positive_scribble.svg'
import { ReactComponent as NegativeScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/negative_scribble.svg'
import { ReactComponent as EraserIcon } from '../../../../../../../static/images/icons/ConfigIcon/eraser.svg'
import { ReactComponent as SizeSliderIcon } from '../../../../../../../static/images/icons/ConfigIcon/size_slider.svg'
import { ReactComponent as S2MIcon } from '../../../../../../../static/images/icons/ConfigIcon/s2m.svg'
import { ReactComponent as ClearIcon } from '../../../../../../../static/images/icons/ConfigIcon/clear.svg'
import { ReactComponent as ThresholdIcon } from '../../../../../../../static/images/icons/ConfigIcon/threshold.svg'
import { ReactComponent as DeleteIcon } from '../../../../../../../static/images/icons/ConfigIcon/delete.svg'



import { SCRIBBLE_TO_MASK_CONSTANTS, SCRIBBLE_TYPES, EVENT_TYPES } from '../../../../../constants'

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

const scribbleToMaskTools = [
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
  {
    tool: SCRIBBLE_TYPES.ERASER,
    name: 'Eraser',
    component: <EraserIcon />
  },
]


const ScribbleToMaskConfig = (props) => {
  const classes = useStyles()
  const { toolConfig, setToolConfig, } = props
  const { scribbleSize, threshold } = toolConfig

  const [isPredicting, setIsPredicting] = useState(false)

  const emitThresholdUpdate = debounce(
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD),
    500
  )

  const handleThresholdChange = (_, newValue) => {
    setToolConfig({ ...toolConfig, threshold: newValue })
    emitThresholdUpdate()
  }

  const handlePredictStart = () => {
    setIsPredicting(true)
  }

  const handlePredictEnd = () => {
    setIsPredicting(false)
  }

  useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.DRAW_MASK.PREDICT]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT)
        .subscribe({ next: (e) => handlePredictStart(e) }),
      [EVENT_TYPES.DRAW_MASK.PREDICT_FINISH]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT_FINISH)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
      [EVENT_TYPES.DRAW_MASK.PREDICT_ERROR]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT_ERROR)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
      // [EVENT_TYPES.DRAW_MASK.CHOOSE_POSITIVE_SCRIBBLE]: getSubject(EVENT_TYPES.DRAW_MASK.CHOOSE_POSITIVE_SCRIBBLE)
      //   .subscribe({ next: (e) => setToolConfig({ ...toolConfig, scribbleType: SCRIBBLE_TYPES.POSITIVE }) }),
      // [EVENT_TYPES.DRAW_MASK.CHOOSE_NEGATIVE_SCRIBBLE]: getSubject(EVENT_TYPES.DRAW_MASK.CHOOSE_NEGATIVE_SCRIBBLE)
      //   .subscribe({ next: (e) => setToolConfig({ ...toolConfig, scribbleType: SCRIBBLE_TYPES.NEGATIVE }) }),
      // [EVENT_TYPES.DRAW_MASK.CHOOSE_ERASER_SCRIBBLE]: getSubject(EVENT_TYPES.DRAW_MASK.CHOOSE_ERASER_SCRIBBLE)
      //   .subscribe({ next: (e) => setToolConfig({ ...toolConfig, scribbleType: SCRIBBLE_TYPES.ERASER }) }),
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
          toolList={scribbleToMaskTools}
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
        <ToolConfigButton
          name={'Clear all scribbles'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.CLEAR_ALL_SCRIBBLES)}
          component={<ClearIcon />}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider}/>
      <div className={classes.optionContainer}>
        <ToolConfigPopUpButton
          name={'Score threshold'}
          component={<ThresholdIcon />}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={threshold}
              onChange={(e) => handleThresholdChange(e, Math.max(Math.min(Number(e.target.value), 100), 0))}
              className={classes.sliderInput}
              type="number"
            />
            <div className={classes.sliderContainer}>
              <Slider
                value={threshold}
                aria-labelledby="threshold-slider"
                step={1}
                min={1}
                max={100}
                valueLabelDisplay="auto"
                onChange={handleThresholdChange}
              />
            </div>
          </div>
        </ToolConfigPopUpButton>
        <ToolConfigButton
          name={'MiVOS - Scribbles to mask'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT)}
          component={<S2MIcon/>}
          disabled={isPredicting}
          isLoading={isPredicting}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider} />
      <div className={classes.optionContainer}>
        <ToolConfigButton
          name={'Delete annotation'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.EDIT.DELETE_ANNOTATION)}
          component={<DeleteIcon />}
        />
      </div>
    </div>
  )
}

export default ScribbleToMaskConfig