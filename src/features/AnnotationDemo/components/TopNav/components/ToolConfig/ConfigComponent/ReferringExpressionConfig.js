import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import { find, get, debounce } from 'lodash'
import usePrevious from '../../../../../../../utils/usePrevious'

import EventCenter from '../../../../../EventCenter'
import { useAnnotationStore } from '../../../../../stores/index'

import ToolConfigButton from '../components/ToolConfigButton'
import ToolConfigPopUpButton from '../components/ToolConfigPopUpButton'
import ToolConfigSelectButton from '../components/ToolConfigSelectButton'
import Slider from '../../../../../../../components/Slider'

import { ReactComponent as ThresholdIcon } from '../../../../../../../static/images/icons/ConfigIcon/threshold.svg'
import { ReactComponent as DeleteIcon } from '../../../../../../../static/images/icons/ConfigIcon/delete.svg'

import { EVENT_TYPES, REFERRING_EXPRESSION_MODELS } from '../../../../../constants'

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
    alignItems: 'center',
  },
  referringExpressionInput: {
    width: 500,
    '& label.MuiFormLabel-root': {
      color: theme.palette.secondary.light
    },
    '& label.Mui-focused': {
      color: theme.palette.secondary.main
    },
    '&:hover': {
      '& label.MuiFormLabel-root': {
        color: theme.palette.secondary.main
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.secondary.light,
      },
      '&.Mui-disabled fieldset': {
        borderColor: theme.palette.secondary.light,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.secondary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
  },
  textFieldInput: {
    color: theme.palette.primary.contrastText
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


const MODEL_OPTIONS = [
  { name: "CMPC", value: REFERRING_EXPRESSION_MODELS.CMPC },
  { name: "Rule-based", value: REFERRING_EXPRESSION_MODELS.RULE_BASED },
]

const ReferringExpressionConfig = (props) => {
  const classes = useStyles()
  const inputRef = useRef(null)
  const { toolConfig, setToolConfig, } = props
  const { threshold, model } = toolConfig

  const [isPredicting, setIsPredicting] = useState(false)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const prevObjectId = usePrevious(selectedObjectId)
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)

  useEffect(() => {
    const currentAnnotationObject = find(annotationObjects, { id: selectedObjectId })
    if (inputRef?.current) {
      if (!(prevObjectId === null && inputRef.current.value !== '')) {
        inputRef.current.value = get(currentAnnotationObject, 'attributes.referringExpression', '')
      }
    }
  }, [selectedObjectId])

  const focusTextInput = () => {
    inputRef.current.focus()
  }

  const handlePredictStart = () => {
    inputRef.current.blur()
    setIsPredicting(true)
  }

  const handlePredictEnd = () => {
    setIsPredicting(false)
  }

  const handleTextChange = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.REFERRING_EXPRESSION_CHANGE)(e.target.value)
  }

  const debouncedHandleTextChange = debounce(handleTextChange, 500, { leading: true, trailing: true })

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)(inputRef?.current?.value)
    }
  }

  const emitThresholdUpdate = debounce(
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.UPDATE_THRESHOLD),
    500
  )

  const handleThresholdChange = (_, newValue) => {
    setToolConfig({ ...toolConfig, threshold: newValue })
    emitThresholdUpdate(newValue)
  }


  useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT)
        .subscribe({ next: (e) => focusTextInput(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)
        .subscribe({ next: (e) => handlePredictStart(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR)
        .subscribe({ next: (e) => handlePredictEnd(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <TextField
          inputRef={inputRef}
          className={classes.referringExpressionInput}
          label="Referring expression"
          variant="outlined"
          color="secondary"
          size="small"
          onChange={debouncedHandleTextChange}
          // onFocus={handleFocusTextInput}
          onKeyPress={handleKeyPress}
          disabled={isPredicting}
          inputProps={{
            className: classes.textFieldInput
          }}
        />
        <ToolConfigSelectButton
          name={'Run referring expression'}
          options={MODEL_OPTIONS}
          value={model}
          handleClick={() => EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)(inputRef?.current?.value)}
          handleSelect={(newModel) => setToolConfig({ ...toolConfig, model: newModel })}
          isLoading={isPredicting}
          disabled={isPredicting}
        />
        <ToolConfigPopUpButton
          name={'Score threshold'}
          component={<ThresholdIcon />}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={threshold}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/^0+/, '')
                handleThresholdChange(e, Math.max(Math.min(Number(e.target.value), 100), 0))
              }}
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

export default ReferringExpressionConfig