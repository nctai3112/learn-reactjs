import React from 'react'

import EventCenter from '../../../EventCenter';
import { useGeneralStore, useAnnotationStore } from '../../../stores/index'

import { MODES, EVENT_TYPES } from '../../../constants';

const EditingHandler = (props) => {
  const { currentAnnotation } = props

  const setActiveMode = useGeneralStore(state => state.setActiveMode)

  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const deleteAnnotation = useAnnotationStore(state => state.deleteAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)

  const handleEditBBox = (data, commitAnnotation = false) => {
    setAnnotation(currentAnnotation.id, data, { commitAnnotation })
  }

  const handleDeleteAnnotation = () => {
    deleteAnnotation(currentAnnotation.id)
  }

  const handleStageClick = (e) => {
    setSelectedObjectId(null)
    setActiveMode(MODES.EDIT.name)
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleStageClick(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleStageClick(e) }),
      [EVENT_TYPES.EDIT.DELETE_ANNOTATION]: getSubject(EVENT_TYPES.EDIT.DELETE_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
      [EVENT_TYPES.EDIT_ANNOTATION]: getSubject(EVENT_TYPES.EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditBBox(data) }),
      [EVENT_TYPES.COMMIT_EDIT_ANNOTATION]: getSubject(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditBBox(data, true) }),
      [EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT]: getSubject(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)
        .subscribe({ next: (data) => handleUnselectCurrentAnnotationObject(data) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [currentAnnotation])
 
  return null
}

export default EditingHandler