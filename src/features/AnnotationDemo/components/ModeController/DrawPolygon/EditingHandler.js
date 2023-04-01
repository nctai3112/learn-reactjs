import React, { useEffect } from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useGeneralStore, useAnnotationStore } from '../../../stores/index'

import { EVENT_TYPES } from '../../../constants'
import checkIsMobileDevice from '../../../../../utils/checkIsMobileDevice'
import { getDistance } from '../../../../../utils/geometryUtil'

const useCutPolygonStore = create((set, get) => ({
  isMouseOverPolygonCutStart: false,
  getIsMouseOverPolygonCutStart: () => get().isMouseOverPolygonCutStart,
  setIsMouseOverPolygonCutStart: (newStatus) => set({ isMouseOverPolygonCutStart: newStatus }),

  cuttingPoly: null,
  getCuttingPoly: () => get().cuttingPoly,
  setCuttingPoly: (newPoly) => set({ cuttingPoly: newPoly }),
  appendCuttingPoly: (newPoint) => set(state => ({ cuttingPoly: [...state.cuttingPoly, newPoint] })),
}))


const EditingHandler = (props) => {
  const { currentAnnotation } = props

  const isMobileDevice = checkIsMobileDevice()
  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const deleteAnnotation = useAnnotationStore(state => state.deleteAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)

  const getIsMouseOverPolygonCutStart = useCutPolygonStore(state => state.getIsMouseOverPolygonCutStart)
  const setIsMouseOverPolygonCutStart = useCutPolygonStore(state => state.setIsMouseOverPolygonCutStart)
  const getCuttingPoly = useCutPolygonStore(state => state.getCuttingPoly)
  const setCuttingPoly = useCutPolygonStore(state => state.setCuttingPoly)
  const appendCuttingPoly = useCutPolygonStore(state => state.appendCuttingPoly)

  useEffect(() => {
    setCuttingPoly(null)
  }, [currentAnnotation?.id])


  const handleClickCutPolygon = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const currentMousePosition = getCurrentMousePosition()

    const cuttingPoly = getCuttingPoly()

    if (cuttingPoly === null) {
      const currentPolys = cloneDeep(currentAnnotation.polygon.polys)
      setAnnotation(currentAnnotation.id, 
        { 
          polys: [...currentPolys, [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]],
          isCutting: true,
        }, 
        { commitAnnotation: false }
      )
      setCuttingPoly([[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]])
    } else {
      let finishCutting = false
      if (!isMobileDevice) {
        finishCutting = getIsMouseOverPolygonCutStart()
      } else {
        finishCutting = cuttingPoly.length >= 3 &&
          getDistance(currentMousePosition, { x: cuttingPoly[0][0] * imageWidth, y: cuttingPoly[0][1] * imageHeight }) <= 10
      }

      if (finishCutting) {
        finishCutPolygon()
      } else {
        const currentPolys = cloneDeep(currentAnnotation.polygon.polys)
        currentPolys.pop()
        setAnnotation(currentAnnotation.id,
          {
            polys: [...currentPolys, [...cuttingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
          },
          { commitAnnotation: false }
        )
        appendCuttingPoly([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
      }
    }
  }


  const finishCutPolygon = () => {
    const cuttingPoly = cloneDeep(getCuttingPoly())

    const currentPolys = cloneDeep(currentAnnotation.polygon.polys)
    currentPolys.pop()
    setAnnotation(currentAnnotation.id, {
      polys: [...currentPolys, cuttingPoly],
      isCutting: false
    }, { commitAnnotation: true })

    setCuttingPoly(null)
    setIsMouseOverPolygonCutStart(false)
  }


  const handleDragCutPolygon = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const cuttingPoly = cloneDeep(getCuttingPoly())
    const currentMousePosition = getCurrentMousePosition()

    if (cuttingPoly !== null) {
      const currentPolys = cloneDeep(currentAnnotation.polygon.polys)
      currentPolys.pop()
      setAnnotation(currentAnnotation.id,
        {
          polys: [...currentPolys, [...cuttingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
        },
        { commitAnnotation: false }
      )
    }
  }


  const handleRightClickCutPolygon = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const cuttingPoly = getCuttingPoly()
    const currentMousePosition = getCurrentMousePosition()

    if (cuttingPoly !== null) {
      const currentPolys = cloneDeep(currentAnnotation.polygon.polys)
      currentPolys.pop()

      const newCuttingPoly = cloneDeep(cuttingPoly)
      newCuttingPoly.pop()
      if (newCuttingPoly.length === 0) { // remove all drawing polygon's points
        setCuttingPoly(null)
        setAnnotation(currentAnnotation.id,
          {
            polys: [...currentPolys],
            isCutting: false,
          },
          { commitAnnotation: false }
        )
      } else {
        setCuttingPoly(newCuttingPoly)
        if (!isMobileDevice) {
          setAnnotation(currentAnnotation.id,
            {
              polys: [...currentPolys, [...newCuttingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
            },
            { commitAnnotation: false }
          )
        } else {
          setAnnotation(currentAnnotation.id,
            {
              polys: [...currentPolys, newCuttingPoly]
            },
            { commitAnnotation: false }
          )
        }
      }
    }
  }


  const handleEditPolygon = (data, commitAnnotation=false) => {
    setAnnotation(currentAnnotation.id, data, { commitAnnotation })
  }

  const handleDeleteAnnotation = () => {
    deleteAnnotation(currentAnnotation.id)
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }


  const handleMouseClick = () => {
    updateCurrentMousePosition()
    handleClickCutPolygon()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDragCutPolygon()
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault()

    updateCurrentMousePosition()
    handleRightClickCutPolygon()
  }

  const handleMouseOverPolygonCutStart = (value) => {
    setIsMouseOverPolygonCutStart(value)
  }


  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.EDIT.DELETE_ANNOTATION]: getSubject(EVENT_TYPES.EDIT.DELETE_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
      [EVENT_TYPES.EDIT_ANNOTATION]: getSubject(EVENT_TYPES.EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditPolygon(data) }),
      [EVENT_TYPES.COMMIT_EDIT_ANNOTATION]: getSubject(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditPolygon(data, true) }),
      [EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT]: getSubject(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)
        .subscribe({ next: (data) => handleUnselectCurrentAnnotationObject(data) }),
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_CONTEXT_MENU]: getSubject(EVENT_TYPES.STAGE_CONTEXT_MENU)
        .subscribe({ next: (e) => handleContextMenu(e) }),
      [EVENT_TYPES.POLYGON.REMOVE_LAST_DRAWN_POINT]: getSubject(EVENT_TYPES.POLYGON.REMOVE_LAST_DRAWN_POINT)
        .subscribe({ next: (e) => handleRightClickCutPolygon(e) }),
      [EVENT_TYPES.MOUSE_OVER_POLYGON_START]: getSubject(EVENT_TYPES.MOUSE_OVER_POLYGON_START)
        .subscribe({ next: (e) => handleMouseOverPolygonCutStart(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [currentAnnotation])

  return (
    null
  )
}

export default EditingHandler