import React, { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { cloneDeep, findIndex } from 'lodash'
import { CancelToken } from 'axios'

import { useAnnotationStore, usePropagationStore } from '../../../../../stores'

import PropagateIcon from '@material-ui/icons/DoubleArrowRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import CancelIcon from '@material-ui/icons/CancelRounded';

import PopoverConfig from './PopoverConfig'
import RestConnector from '../../../../../../../connectors/RestConnector'

import MaskAnnotationClass from '../../../../../../../classes/MaskAnnotationClass'

import { PROPAGATION_DIRECTION } from '../../../../../constants'


const useStyles = makeStyles(theme => ({
  root: {

  },
  pointerUp: {
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: `10px solid ${theme.palette.primary.dark}`
  },
  configContainer: {
    padding: 5,
    borderRadius: 5,
    background: theme.palette.primary.dark,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  configInfo: {
    marginRight: 10,
    background: theme.palette.primary.darker,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
    '&:hover': {
      background: theme.palette.primary.darker,
    }
  }
}))

const PropagationConfig = (props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);

  const { playingFrame, frames, annotations, selectedObjectId } = props

  const updateAnnotation = useAnnotationStore(state => state.updateAnnotation)
  const updateAnnotations = useAnnotationStore(state => state.updateAnnotations)
  const appendAnnotations = useAnnotationStore(state => state.appendAnnotations)
  const updatePropagatedAnnotations = useAnnotationStore(state => state.updatePropagatedAnnotations)
  const cleanUpPropagatingAnnotations = useAnnotationStore(state => state.cleanUpPropagatingAnnotations)


  const setPropagationTask = usePropagationStore(state => state.setPropagationTask)

  const isPropagating = usePropagationStore(state => state.isPropagating)
  const getIsPropagating = usePropagationStore(state => state.getIsPropagating)
  const setIsPropagating = usePropagationStore(state => state.setIsPropagating)
  const blockPropagation = usePropagationStore(state => state.blockPropagation)
  const setBlockPropagation = usePropagationStore(state => state.setBlockPropagation)
  const getLocalAnnotationStore = usePropagationStore(state => state.getLocalAnnotationStore)
  const setLocalAnnotationStore = usePropagationStore(state => state.setLocalAnnotationStore)
  const updateLocalAnnotationStore = usePropagationStore(state => state.updateLocalAnnotationStore)
  const setCancelToken = usePropagationStore(state => state.setCancelToken)
  const getCancelToken = usePropagationStore(state => state.getCancelToken)


  const [propagationConfig, setPropagationConfig] = useState({
    direction: PROPAGATION_DIRECTION.FORWARD,
    frames: 20
  })
  const nextKeyFrame = useMemo(() => {
    const nextKeyFrameIndex = findIndex(annotations.slice(playingFrame + 1), ann => !!ann?.keyFrame)
    if (nextKeyFrameIndex >= 0) {
      return playingFrame + nextKeyFrameIndex + 1
    } else {
      return annotations.length
    }
  }, [annotations, playingFrame])


  let lastFrame = {}
  const runPropagation = async (keyFrame, numFrames, direction) => {
    const BATCH_SIZE = 10
    const totalFrames = frames.length

    let count = 0
    for (count = 1; count <= numFrames; count += BATCH_SIZE) {
      let isPropagating = getIsPropagating()
      if (!isPropagating) return
      let propagatingFrames = []
      for (let j = 0; j < Math.min(BATCH_SIZE, numFrames - count + 1) && keyFrame + count + j < totalFrames; ++j) {
        const frameIndex = keyFrame + (direction === PROPAGATION_DIRECTION.FORWARD ? 1 : -1) * (count + j)
        if (annotations[frameIndex]?.keyFrame) {
          continue;
        }
        propagatingFrames.push(frameIndex)
      }

      if (propagatingFrames.length === 0) {
        return cleanUpCanceledPropagation()
      }
      try {
        let propagationData = {
          "annotation_id": annotations[keyFrame].id,
          "key_frame": keyFrame,
          "propagating_frames": propagatingFrames,
          ...lastFrame
        }
        const breakKeyFrame = await RestConnector.post('/mask_propagation/predict', propagationData, {
          cancelToken: getCancelToken().token
        })
          .then(response => response.data)
          .then((propagatedMasks) => {
            lastFrame.mask_url = propagatedMasks[propagatedMasks.length - 1].URL
            // Assign urls to annotations and commit
            return setPropagatedMasks(propagatingFrames, propagatedMasks)
          })

        // Reaching a new key frame => stop propagation
        if (!!breakKeyFrame) {
          return cleanUpCanceledPropagation()
        }
      } catch (error) {
        console.log("Canceled propagation")
        return cleanUpCanceledPropagation()
      }

      lastFrame.key_frame = propagatingFrames[propagatingFrames.length - 1]
    }
  }

  const setPropagatedMasks = async (propagatedFrames, propagatedMasks) => {
    const localAnnotationStore = getLocalAnnotationStore()

    const newAnnotations = await Promise.all(propagatedFrames.map(async (frameIndex, index) => {
      const newAnnotation = localAnnotationStore[frameIndex]
      await newAnnotation.setMask(propagatedMasks[index])
      newAnnotation.isPropagating = false
      newAnnotation.isTemporary = false
      return newAnnotation
    }))

    newAnnotations.forEach((annotation, index) => {
      const frameIndex = propagatedFrames[index]
      updateLocalAnnotationStore(frameIndex, annotation)
    })
    const breakKeyFrame = await updatePropagatedAnnotations(cloneDeep(newAnnotations), { commitAnnotation: true })

    return breakKeyFrame
  }

  const cleanUpCanceledPropagation = async () => {
    await cleanUpPropagatingAnnotations()
  }

  const handleStartPropagation = async () => {
    setIsPropagating(true)
    setBlockPropagation(true)
    setCancelToken(CancelToken.source())
    const keyFrame = cloneDeep(playingFrame)
    const numFrames = Math.min(nextKeyFrame - playingFrame - 1, cloneDeep(propagationConfig.frames))
    const direction = cloneDeep(propagationConfig.direction)
    setPropagationTask({
      keyFrame,
      numFrames,
      direction
    })

    try {
      const keyAnnotation = cloneDeep(annotations[keyFrame])
      keyAnnotation.keyFrame = true
      await updateAnnotation(keyAnnotation, { commitAnnotation: true })
  
      const localAnnotationStore = {}
      // Create local annotations
      let newAnnotationsDict = {}
      let newTemporaryAnnotations = []
      for (let i = 1; i <= numFrames; ++i) {
        const frameIndex = keyFrame + (direction === PROPAGATION_DIRECTION.FORWARD ? 1 : -1) * i
        if (!!annotations[frameIndex]) {
          if (annotations[frameIndex].keyFrame) {
            break;
          } else {
            const newAnnotation = cloneDeep(annotations[frameIndex])
            newAnnotation.isPropagating = true
            newAnnotationsDict[newAnnotation.id] = newAnnotation
            localAnnotationStore[frameIndex] = newAnnotation
          }
        } else {
          const newAnnotation = new MaskAnnotationClass('', selectedObjectId, frames[frameIndex].id, {}, false)
          newAnnotation.isPropagating = true
          newAnnotation.isTemporary = true
          newTemporaryAnnotations.push(newAnnotation)
          localAnnotationStore[frameIndex] = newAnnotation
        }
      }
  
      await updateAnnotations(cloneDeep(newAnnotationsDict), { commitAnnotation: false })
      await appendAnnotations(cloneDeep(newTemporaryAnnotations), { commitAnnotation: false })
      setLocalAnnotationStore(localAnnotationStore)
    
      await runPropagation(keyFrame, numFrames, direction)
    } catch (error) {
      console.log(error)
    }

    setIsPropagating(false)
    setBlockPropagation(false)
    setLocalAnnotationStore({})
  }

  const handleCancelPropagation = () => {
    setIsPropagating(false)
    const source = getCancelToken()
    source.cancel("Cancel propagating request")
  }

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid container item xs={12} justifyContent="center">
        <Grid container item xs={12} justifyContent="center">
          <div className={classes.pointerUp}></div>
        </Grid>
        <div className={classes.configContainer}>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.BACKWARD) &&
            (!isPropagating ?
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<PropagateIcon fontSize="small" style={{ transform: `rotate(180deg)` }} />}
                disabled={!!!annotations[playingFrame] || blockPropagation}
                onClick={handleStartPropagation}
              >
                Backward
              </Button>
              :
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<CancelIcon fontSize="small" />}
                onClick={handleCancelPropagation}
              >
                Cancel
              </Button>
            )}
          <PopoverConfig
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            propagationConfig={propagationConfig}
            setPropagationConfig={setPropagationConfig}
            maxValue={nextKeyFrame - playingFrame - 1}
          />
          <Button
            color="secondary"
            size="small"
            className={classes.configInfo}
            startIcon={<SettingsIcon fontSize="small" />}
            onClick={(e) => { !blockPropagation && setAnchorEl(e.currentTarget) }}
          >
            {Math.min(nextKeyFrame - playingFrame - 1, propagationConfig.frames)} frames
          </Button>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.FORWARD) &&
            (!isPropagating ?
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                endIcon={<PropagateIcon fontSize="small" />}
                disabled={!!!annotations[playingFrame] || blockPropagation}
                onClick={handleStartPropagation}
              >
                Forward
              </Button>
              :
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<CancelIcon fontSize="small" />}
                onClick={handleCancelPropagation}
              >
                Cancel
              </Button>
            )}
        </div>
      </Grid>
    </Grid>
  )
}

export default PropagationConfig