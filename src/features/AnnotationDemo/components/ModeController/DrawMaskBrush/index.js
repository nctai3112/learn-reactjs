import React, { useEffect } from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from '../../../stores/index'

import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'
import StorageFileClass from '../../../../../classes/StorageFileClass'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants'

import drawBrushToMask from './drawBrushToMask'
import sendFormData from '../../../../../utils/sendFormData'

const useMaskBrushStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),
}))

const DrawMaskBrush = () => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const getSelectedObjectId = useAnnotationStore(state => state.getSelectedObjectId)
  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const setAnnotationWithImageId = useAnnotationStore(state => state.setAnnotationWithImageId)
  const deleteAnnotation = useAnnotationStore(state => state.deleteAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)

  const getToolConfig = useGeneralStore(state => state.getToolConfig)

  const getIsDrawingScribble = useMaskBrushStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useMaskBrushStore(state => state.setIsDrawingScribble)

  const getCurrentAnnotation = async (createIfNotExist = true) => {
    const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, {
      ...DEFAULT_ANNOTATION_ATTRS,
      fill: '#FFFFFF'
    })
    const annotationImageId = getCurrentAnnotationImageId()

    const drawingAnnotation = getAnnotationByAnnotationObjectId(objectId, annotationImageId)

    if (drawingAnnotation) {
      return drawingAnnotation
    } else {
      if (!createIfNotExist) {
        return null
      }
      const toolConfig = getToolConfig()

      const newAnnotation = new MaskAnnotationClass('', objectId, annotationImageId, {
        maskBrushes: [],
        scribbles: [],
        mask: new StorageFileClass(),
        threshold: toolConfig.threshold
      }, true)
  
      await appendAnnotation(newAnnotation, { commitAnnotation: true })
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

    let maskBrushes = cloneDeep(drawingAnnotation.maskData.maskBrushes)
    if (maskBrushes.length > 0) {
      return;
    }
    maskBrushes.push({
      points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
      type: toolConfig.scribbleType,
      strokeWidth: toolConfig.scribbleSize,
    })

    setAnnotationWithImageId(drawingAnnotation.id, drawingAnnotation.annotationImageId, { maskBrushes }, { commitAnnotation: false })
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

    let maskBrushes = cloneDeep(drawingAnnotation.maskData.maskBrushes)
    let drawingScribble = maskBrushes.pop()
    if (!drawingScribble){
      return
    }
    drawingScribble.points.push([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
    maskBrushes = [...maskBrushes, drawingScribble]

    setAnnotationWithImageId(drawingAnnotation.id, drawingAnnotation.annotationImageId, { maskBrushes }, { commitAnnotation: false })
  }

  const handleFinishDrawByBrush = async () => {
    const isDrawingScribble = getIsDrawingScribble()
    if (!isDrawingScribble) {
      return
    }

    const drawingAnnotation = await getCurrentAnnotation(false)
    if (!drawingAnnotation) return;

    const renderingSize = getRenderingSize()

    setIsDrawingScribble(false)

    let maskBrushes = cloneDeep(drawingAnnotation.maskData.maskBrushes)
    const maskBitmap = await drawingAnnotation.maskData.mask.getBitmap()
    const newMaskBlob = await drawBrushToMask(
      maskBitmap,
      maskBrushes, 
      { canvasWidth: renderingSize.width, canvasHeight: renderingSize.height }
    )
    drawingAnnotation.maskData.mask.blob = newMaskBlob
    await drawingAnnotation.maskData.mask.getBitmap()

    const uploadedMask = await sendFormData(
      '/annotations/upload-annotation-mask',
      {
        annotation_id: drawingAnnotation.id,
        mask: newMaskBlob
      }
    )

    drawingAnnotation.maskData.maskBrushes = []
    await drawingAnnotation.setMask(uploadedMask)

    setAnnotationWithImageId(drawingAnnotation.id, drawingAnnotation.annotationImageId, cloneDeep(drawingAnnotation.maskData), { commitAnnotation: true, setKeyFrame: true })
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

export default DrawMaskBrush