import React from 'react'
import { find } from 'lodash'

import { useDatasetStore, useAnnotationStore } from '../../../stores/index'

import DrawingHandler from './DrawingHandler'
import EditingHandler from './EditingHandler'

const DrawBBox = (props) => {
  const currentAnnotationImageId = useDatasetStore(state => state.currentAnnotationImageId)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotations = useAnnotationStore(state => state.annotations[currentAnnotationImageId] || [])

  const currentAnnotation = find(annotations, { annotationObjectId: selectedObjectId })

  return (currentAnnotation ? 
    <EditingHandler currentAnnotation={currentAnnotation} {...props}/>
    : <DrawingHandler {...props}/>
  )
}

export default DrawBBox