import React, { useEffect, useState } from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from '../../../stores/index'

import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'
import StorageFileClass from '../../../../../classes/StorageFileClass'
import MiVOSScribbleToMaskBuilder from './MiVOSScribbleToMaskBuilder/index'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants'

const useScribbleToMaskStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),

  miVOSBuilder: new MiVOSScribbleToMaskBuilder(),
  getMiVOSBuilder: () => get().miVOSBuilder,
  setMiVOSBuilder: (newBuilder) => set({ miVOSBuilder: newBuilder }),
}))

const ScribbleToMask = (props) => {
  const [isPredicting, setIsPredicting] = useState(false)
  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const getSelectedObjectId = useAnnotationStore(state => state.getSelectedObjectId)
  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const updateAnnotation = useAnnotationStore(state => state.updateAnnotation)
  const deleteAnnotation = useAnnotationStore(state => state.deleteAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)

  const getToolConfig = useGeneralStore(state => state.getToolConfig)

  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)
  const getMiVOSBuilder = useScribbleToMaskStore(state => state.getMiVOSBuilder)
  const setMiVOSBuilder = useScribbleToMaskStore(state => state.setMiVOSBuilder)


  const getCurrentAnnotation = async (createIfNotExist = true) => {
    const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, {
      ...DEFAULT_ANNOTATION_ATTRS,
      fill: '#FFFFFF'
    })
    const annotationImageId = getCurrentAnnotationImageId()

    const drawingAnnotation = getAnnotationByAnnotationObjectId(objectId, annotationImageId)

    if (drawingAnnotation) {
      let miVOSBuilder = getMiVOSBuilder()
      miVOSBuilder.setAnnotationId(drawingAnnotation.id)

      return drawingAnnotation
    } else {
      if (!createIfNotExist) {
        return null
      }
      const toolConfig = getToolConfig()

      const newAnnotation = new MaskAnnotationClass('', objectId, annotationImageId, {
        scribbles: [],
        mask: new StorageFileClass(),
        threshold: toolConfig.threshold
      }, true)
  
      let miVOSBuilder = getMiVOSBuilder()
      miVOSBuilder.setAnnotationId(newAnnotation.id)
      miVOSBuilder.setScribbles([])
      miVOSBuilder.setMask(null)
  
      await appendAnnotation(newAnnotation, { commitAnnotation: false })
      return newAnnotation
    }
  }

  const handleStartDrawByBrush = async () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const drawingAnnotation = await getCurrentAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const toolConfig = getToolConfig()

    let scribbles = cloneDeep(drawingAnnotation.maskData.scribbles) || []
    scribbles.push({
      points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
      type: toolConfig.scribbleType,
      strokeWidth: toolConfig.scribbleSize,
    })

    setAnnotation(drawingAnnotation.id, { scribbles }, { commitAnnotation: true })

    setIsDrawingScribble(true)
  }

  const handleDrawByBrush = async () => {
    const isDrawingScribble = getIsDrawingScribble()
    if (!isDrawingScribble) {
      return
    }
    
    const drawingAnnotation = await getCurrentAnnotation(false)
    if (!drawingAnnotation) return;

    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const currentMousePosition = getCurrentMousePosition()

    let scribbles = cloneDeep(drawingAnnotation.maskData.scribbles)
    let drawingScribble = scribbles.pop()
    if (!drawingScribble){
      return
    }
    drawingScribble.points.push([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
    scribbles = [...scribbles, drawingScribble]
    setAnnotation(drawingAnnotation.id, { scribbles }, { commitAnnotation: false })
  }

  const handleFinishDrawByBrush = async () => {
    const isDrawingScribble = getIsDrawingScribble()
    if (!isDrawingScribble) {
      return
    }

    setIsDrawingScribble(false)
    const drawingAnnotation = await getCurrentAnnotation(false)
    if (!drawingAnnotation) return;

    setAnnotation(drawingAnnotation.id, {}, { commitAnnotation: true })

    let miVOSBuilder = getMiVOSBuilder()
    await miVOSBuilder.setScribbles(drawingAnnotation.maskData.scribbles)
    setMiVOSBuilder(miVOSBuilder)
  }

  const handleClearAllScribbles = async () => {
    if (!instanceId) {
      return
    }
    const drawingAnnotation = await getCurrentAnnotation(false)
    if (!drawingAnnotation) return;

    setAnnotation(drawingAnnotation.id, {
      scribbles: []
    }, { commitAnnotation: true })

    let miVOSBuilder = getMiVOSBuilder()
    await miVOSBuilder.setScribbles([])
    setMiVOSBuilder(miVOSBuilder)
  }

  
  const handleDragStart = (e) => {
    const stage = e.target.getStage()
    e.evt.preventDefault()
    if (stage.isDragging()) {
      stage.stopDrag();
    }
  }

  const handleMouseDown = () => {
    updateCurrentMousePosition()
    handleStartDrawByBrush()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDrawByBrush()
  }

  const handleMouseUp = () => {
    handleFinishDrawByBrush()
  }

  const handleMouseEnter = () => {
    handleFinishDrawByBrush()
  }

  const handleUpdateThreshold = async () => {
    if (!instanceId) {
      return
    }
    const drawingAnnotation = await getCurrentAnnotation(false)
    if (!drawingAnnotation) return;

    const toolConfig = getToolConfig()

    setAnnotation(drawingAnnotation.id, {
      threshold: toolConfig.threshold
    }, { commitAnnotation: true })
  }

  const handleTriggerPredict = async () => {
    if (!instanceId) {
      alert("Image not found")
      EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT_ERROR)()
      return
    }
    if (isPredicting) {
      return
    }
    setIsPredicting(true)
    const drawingAnnotation = await getCurrentAnnotation()
    if (drawingAnnotation.isTemporary) {
      drawingAnnotation.isTemporary = false
      drawingAnnotation.keyFrame = true
      await updateAnnotation(drawingAnnotation, { commitAnnotation: true })
    }
    let miVOSBuilder = getMiVOSBuilder()

    const { scribbles} = drawingAnnotation.maskData
    await miVOSBuilder.setScribbles(scribbles)

    const data = miVOSBuilder.getMiVOSScribbleToMaskInput()
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M)(data)
  }

  const handleFinishPredict = async (data) => {
    const drawingAnnotation = await getCurrentAnnotation()

    await drawingAnnotation.setMask(data)

    setAnnotation(drawingAnnotation.id, cloneDeep(drawingAnnotation.maskData), { commitAnnotation: true, setKeyFrame: true })
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT_FINISH)()
    setIsPredicting(false)
  }

  const handlePredictError = () => {
    alert("Prediction error")
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT_ERROR)()
    setIsPredicting(false)
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }

  const handleDeleteAnnotation = () => {
    const currentObjectId = getSelectedObjectId()
    if (!currentObjectId) return
  
    const annotationImageId = getCurrentAnnotationImageId()
    const currentAnnotation = getAnnotationByAnnotationObjectId(currentObjectId, annotationImageId)

    if (!currentAnnotation) return
    deleteAnnotation(currentAnnotation.id)
    setIsDrawingScribble(false)
  }

  useEffect(() => {
    if (!instanceId) {
      return
    }
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_DRAG_START]: getSubject(EVENT_TYPES.STAGE_DRAG_START)
        .subscribe({ next: (e) => handleDragStart(e) }),
      [EVENT_TYPES.STAGE_MOUSE_DOWN]: getSubject(EVENT_TYPES.STAGE_MOUSE_DOWN)
        .subscribe({ next: (e) => handleMouseDown(e) }),
      [EVENT_TYPES.STAGE_TOUCH_START]: getSubject(EVENT_TYPES.STAGE_TOUCH_START)
        .subscribe({ next: (e) => handleMouseDown(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_TOUCH_MOVE]: getSubject(EVENT_TYPES.STAGE_TOUCH_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_MOUSE_UP]: getSubject(EVENT_TYPES.STAGE_MOUSE_UP)
        .subscribe({ next: (e) => handleMouseUp(e) }),
      [EVENT_TYPES.STAGE_TOUCH_END]: getSubject(EVENT_TYPES.STAGE_TOUCH_END)
        .subscribe({ next: (e) => handleMouseUp(e) }),
      [EVENT_TYPES.STAGE_MOUSE_ENTER]: getSubject(EVENT_TYPES.STAGE_MOUSE_ENTER)
        .subscribe({ next: (e) => handleMouseEnter(e) }),
      [EVENT_TYPES.DRAW_MASK.PREDICT]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT)
        .subscribe({ next: (e) => handleTriggerPredict(e) }),
      [EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_ERROR]: getSubject(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_ERROR)
        .subscribe({ next: (e) => handlePredictError(e) }),
      [EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_FINISH]: getSubject(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_FINISH)
        .subscribe({ next: (e) => handleFinishPredict(e) }),
      [EVENT_TYPES.DRAW_MASK.CLEAR_ALL]: getSubject(EVENT_TYPES.DRAW_MASK.CLEAR_ALL_SCRIBBLES)
        .subscribe({ next: (e) => handleClearAllScribbles(e) }),
      [EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD]: getSubject(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD)
        .subscribe({ next: (e) => handleUpdateThreshold(e) }),
      [EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT]: getSubject(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)
        .subscribe({ next: (e) => handleUnselectCurrentAnnotationObject(e) }),
      [EVENT_TYPES.EDIT.DELETE_ANNOTATION]: getSubject(EVENT_TYPES.EDIT.DELETE_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default ScribbleToMask