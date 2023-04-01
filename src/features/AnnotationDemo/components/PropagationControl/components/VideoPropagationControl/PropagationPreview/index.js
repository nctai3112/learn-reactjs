import React, { useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { cloneDeep } from 'lodash'

import { useAnnotationStore, usePropagationStore } from '../../../../../stores'

import RestConnector from '../../../../../../../connectors/RestConnector'

import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 30,
    display: 'flex',
    justifyContent: 'center',
  }
}))

const PropagationPreview = (props) => {
  const classes = useStyles()
  const { playingFrame, annotations } = props

  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const updatePropagatedAnnotations = useAnnotationStore(state => state.updatePropagatedAnnotations)

  const getPropagationTask = usePropagationStore(state => state.getPropagationTask)

  const isPropagatingCurrentFrame = useMemo(() => {
    const currentAnnotation = annotations[playingFrame]
    return !!currentAnnotation && currentAnnotation.isPropagating
  }, [playingFrame, annotations])

  const [blockLoadPreview, setBlockPreview] = useState(false)


  const loadPropagationResultPreview = () => {
    setBlockPreview(true)
    const currentAnnotation = annotations[playingFrame]
    
    const propagationTask = getPropagationTask()
    const { keyFrame } = propagationTask
    RestConnector.post('/mask_propagation/predict', {
      "annotation_id": annotations[keyFrame].id,
      "key_frame": keyFrame,
      "propagating_frames": [playingFrame]
    })
      .then(response => response.data)
      .then(async maskURLs => {
        const maskURL = maskURLs[0]
        await currentAnnotation.setMask(maskURL)

        const latestCurrentAnnotation = getAnnotationByAnnotationObjectId(currentAnnotation.annotationObjectId, currentAnnotation.annotationImageId)
        if (!latestCurrentAnnotation.isPropagating) return;
        updatePropagatedAnnotations([cloneDeep(currentAnnotation)], { commitAnnotation: false })
      })
      .catch(err => console.log(err))
      .finally(() => {
        setBlockPreview(false)
      })
  }


  return (
    <div className={classes.root}>
      {isPropagatingCurrentFrame &&
        <Button
          startIcon={<VisibilityIcon size="small" />}
          size="small"
          disabled={blockLoadPreview}
          onClick={loadPropagationResultPreview}
        >
          Preview
        </Button>
      }
    </div>
  )
}

export default PropagationPreview