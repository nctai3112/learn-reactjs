import React, { useEffect } from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useGeneralStore, useDatasetStore, useAnnotationStore } from '../../../stores'

import PolygonAnnotationClass from '../../../../../classes/PolygonAnnotationClass'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';

import { getDistance } from '../../../../../utils/geometryUtil'
import checkIsMobileDevice from '../../../../../utils/checkIsMobileDevice'

const useDrawPolygonStore = create((set, get) => ({
  isMouseOverPolygonStart: false,
  getIsMouseOverPolygonStart: () => get().isMouseOverPolygonStart,
  setIsMouseOverPolygonStart: (newStatus) => set({ isMouseOverPolygonStart: newStatus }),

  drawingPoly: null,
  getDrawingPoly: () => get().drawingPoly,
  setDrawingPoly: (newPoly) => set({ drawingPoly: newPoly }),
  appendDrawingPoly: (newPoint) => set(state => ({ drawingPoly: [...state.drawingPoly, newPoint] })),
}))

const DrawingHandler = (props) => {
  const isMobileDevice = checkIsMobileDevice()

  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useAnnotationStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useAnnotationStore(state => state.setDrawingAnnotation)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)

  const getIsMouseOverPolygonStart = useDrawPolygonStore(state => state.getIsMouseOverPolygonStart)
  const setIsMouseOverPolygonStart = useDrawPolygonStore(state => state.setIsMouseOverPolygonStart)
  const getDrawingPoly = useDrawPolygonStore(state => state.getDrawingPoly)
  const setDrawingPoly = useDrawPolygonStore(state => state.setDrawingPoly)
  const appendDrawingPoly = useDrawPolygonStore(state => state.appendDrawingPoly)

  useEffect(() => {
    setDrawingPoly(null)
    if (!selectedObjectId) {
      setDrawingAnnotation(null)
      setIsMouseOverPolygonStart(false)
    }
  }, [selectedObjectId])

  const handleClickDrawPolygon = async () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const currentMousePosition = getCurrentMousePosition()
    const drawingPolygon = getDrawingAnnotation()

    const drawingPoly = getDrawingPoly()

    if (drawingPoly === null) {
      const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.POLYGON, DEFAULT_ANNOTATION_ATTRS)
      const annotationImageId = getCurrentAnnotationImageId()

      setDrawingAnnotation(new PolygonAnnotationClass('', objectId, annotationImageId, {
        x: 0,
        y: 0,
        polys: [[[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
      }, true))
      setDrawingPoly([[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]])
    } else {
      let finishDrawing = false
      if (!isMobileDevice) {
        finishDrawing = getIsMouseOverPolygonStart()
      } else {
        finishDrawing = drawingPoly.length >= 3 && 
          getDistance(currentMousePosition, { x: drawingPoly[0][0] * imageWidth, y: drawingPoly[0][1] * imageHeight }) <= 10
      }


      if (finishDrawing) {
        finishDrawPolygon()
      } else {
        const newDrawingAnnotation = cloneDeep(drawingPolygon)
        newDrawingAnnotation.updateData = {
          polys: [[...drawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
        }
        setDrawingAnnotation(newDrawingAnnotation)
        appendDrawingPoly([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
      }
    }
  }

  const finishDrawPolygon = () => {
    const drawingPolygon = getDrawingAnnotation()
    const drawingPoly = getDrawingPoly()

    const finishedPolygon = cloneDeep(drawingPolygon)
    finishedPolygon.updateData = {
      polys: [drawingPoly]
    }

    appendAnnotation(finishedPolygon, { commitAnnotation: true, awaitUpdate: false })
    setDrawingAnnotation(null)
    setDrawingPoly(null)
    setIsMouseOverPolygonStart(false)
    // EventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedPolygon.id)
  }


  const handleDragDrawPolygon = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const drawingPoly = cloneDeep(getDrawingPoly())
    const drawingPolygon = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    if (drawingPoly !== null) {
      let newDrawingPolygon = cloneDeep(drawingPolygon)
      newDrawingPolygon.updateData = {
        polys: [[...drawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
      }
      setDrawingAnnotation(newDrawingPolygon)
    }
  }


  const handleRightClickDrawPolygon = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const drawingPoly = getDrawingPoly()
    const drawingPolygon = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    if (drawingPoly !== null) {
      const newDrawingPoly = cloneDeep(drawingPoly)
      newDrawingPoly.pop()
      if (newDrawingPoly.length === 0) { // remove all drawing polygon's points
        setDrawingAnnotation(null)
        setDrawingPoly(null)
      } else {
        const newPolygon = cloneDeep(drawingPolygon)
        if (!isMobileDevice) {
          newPolygon.updateData = {
            polys: [[...newDrawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
          }
        } else {
          newPolygon.updateData = {
            polys: [newDrawingPoly]
          }
        }
        setDrawingPoly(newDrawingPoly)
        setDrawingAnnotation(newPolygon)
      }
    }
  }

  const handleMouseOverPolygonStart = (value) => {
    setIsMouseOverPolygonStart(value)
  }

  const handleMouseClick = () => {
    updateCurrentMousePosition()
    handleClickDrawPolygon()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDragDrawPolygon()
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault()

    updateCurrentMousePosition()
    handleRightClickDrawPolygon()
  }

  const handleDeleteAnnotation = () => {
    setDrawingAnnotation(null)
    setDrawingPoly(null)
    setIsMouseOverPolygonStart(false)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_CONTEXT_MENU]: getSubject(EVENT_TYPES.STAGE_CONTEXT_MENU)
        .subscribe({ next: (e) => handleContextMenu(e) }),
      [EVENT_TYPES.POLYGON.REMOVE_LAST_DRAWN_POINT]: getSubject(EVENT_TYPES.POLYGON.REMOVE_LAST_DRAWN_POINT)
        .subscribe({ next: (e) => handleRightClickDrawPolygon(e) }),
      [EVENT_TYPES.MOUSE_OVER_POLYGON_START]: getSubject(EVENT_TYPES.MOUSE_OVER_POLYGON_START)
        .subscribe({ next: (e) => handleMouseOverPolygonStart(e) }),
      [EVENT_TYPES.EDIT.DELETE_ANNOTATION]: getSubject(EVENT_TYPES.EDIT.DELETE_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
      [EVENT_TYPES.POLYGON.CANCEL_DRAWING_POLYGON]: getSubject(EVENT_TYPES.POLYGON.CANCEL_DRAWING_POLYGON)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default DrawingHandler