import React, { useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { find } from 'lodash'

import { useDatasetStore, useAnnotationStore } from '../../../../stores/index'
import EventCenter from '../../../../EventCenter'

import PropagationPreview from './PropagationPreview/index.js'
import LiteFrameCarousel from './LiteFrameCarousel/index.js'
import PropagationConfig from './PropagationConfig/index.js'

import { EVENT_TYPES } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5px 10px',
    width: '100%',
    background: theme.palette.secondary.light
  },
}))

const VideoPropagationControl = (props) => {
  const classes = useStyles()

  const videoId = useDatasetStore(state => state.instanceId)
  const video = useDatasetStore(useCallback(state => find(state.dataInstances, { id: videoId }), [videoId]))
  const playingState = useDatasetStore(state => state.playingState)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotations = useAnnotationStore(state => state.annotations)

  const { frames } = video
  const { playingFrame } = playingState

  const currentAnnotations = useMemo(() =>
    frames.map((frame) => {
      const frameAnnotations = annotations[frame.id]
      return find(frameAnnotations, { annotationObjectId: selectedObjectId })
    }
  ), [selectedObjectId, annotations, frames])

  useEffect(() => {
    EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE)()

    return EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE)
  }, [])


  return (
    <Grid container className={classes.root} direction="row">
      <PropagationPreview playingFrame={playingFrame} annotations={currentAnnotations}/>
      <LiteFrameCarousel playingFrame={playingFrame} annotations={currentAnnotations}/>
      <PropagationConfig
        selectedObjectId={selectedObjectId}
        playingFrame={playingFrame} 
        frames={frames}
        annotations={currentAnnotations}  
      />
    </Grid>
  )
}

export default VideoPropagationControl