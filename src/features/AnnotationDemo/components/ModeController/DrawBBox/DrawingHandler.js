import React from 'react'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useGeneralStore, useDatasetStore, useAnnotationStore } from '../../../stores/index'

import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';


const DrawingHandler = (props) => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useAnnotationStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useAnnotationStore(state => state.setDrawingAnnotation)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)


  const handleClickDrawRectangle = async () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation === null) {
      const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.BBOX, DEFAULT_ANNOTATION_ATTRS)
      const annotationImageId = getCurrentAnnotationImageId()
      setDrawingAnnotation(new BBoxAnnotationClass('', objectId, annotationImageId, {
        x: currentMousePosition.x / imageWidth,
        y: currentMousePosition.y / imageHeight,
        width: 0,
        height: 0,
      }, true))
    } else {
      finishDrawRectangle()
    }
  }

  const finishDrawRectangle = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()
    let finishedRectangle = cloneDeep(drawingAnnotation)

    const bBoxWidth = currentMousePosition.x / imageWidth - drawingAnnotation.bBox.x
    const bBoxHeight = currentMousePosition.y / imageHeight - drawingAnnotation.bBox.y

    const annotationImageId = getCurrentAnnotationImageId()

    finishedRectangle.updateData = {
      x: (finishedRectangle.bBox.x + Math.min(0, bBoxWidth)),
      width: Math.abs(bBoxWidth),
      y: (finishedRectangle.bBox.y + Math.min(0, bBoxHeight)),
      height: Math.abs(bBoxHeight)
    }
    finishedRectangle.annotationImageId = annotationImageId

    setDrawingAnnotation(null)
    appendAnnotation(finishedRectangle, { commitAnnotation: true, awaitUpdate: false })
    // EventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedRectangle.id)
  }


  const handleDragDrawRectangle = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation !== null) {
      let newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.updateData = {
        width: currentMousePosition.x / imageWidth - drawingAnnotation.bBox.x,
        height: currentMousePosition.y / imageHeight - drawingAnnotation.bBox.y,
      }
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleMouseClick = (e) => {
    updateCurrentMousePosition()
    handleClickDrawRectangle()
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault()
    updateCurrentMousePosition()
    // cancel drawing annotation
    setDrawingAnnotation(null)
  }

  const handleMouseMove = (e) => {
    updateCurrentMousePosition()
    handleDragDrawRectangle()
  }

  const handleDeleteAnnotation = () => {
    setDrawingAnnotation(null)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_CONTEXT_MENU]: getSubject(EVENT_TYPES.STAGE_CONTEXT_MENU)
        .subscribe({ next: (e) => handleContextMenu(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.EDIT.DELETE_ANNOTATION]: getSubject(EVENT_TYPES.EDIT.DELETE_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
      [EVENT_TYPES.BBOX.CANCEL_DRAWING_BBOX]: getSubject(EVENT_TYPES.BBOX.CANCEL_DRAWING_BBOX)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return (
    null
  )
}

export default DrawingHandler