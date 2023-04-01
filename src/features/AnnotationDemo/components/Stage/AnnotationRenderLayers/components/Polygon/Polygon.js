import React from 'react'
import { Group } from 'react-konva'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../../../EventCenter'
import { useGeneralStore, useAnnotationStore } from '../../../../../stores/index'

import PolygonPath from './PolygonPath'
import PolygonMainPoints from './PolygonMainPoints'
import PolygonMidPoints from './PolygonMidPoints'

import { EVENT_TYPES } from '../../../../../constants'

const Polygon = (props) => {
  const { annotation } = props

  const { id, polygon, properties, annotationObjectId } = annotation
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)
  const [draggingPointKey, setDraggingPointKey] = React.useState(null)
  const [draggingMidPoint, setDraggingMidPoint] = React.useState(null)

  const stage = useGeneralStore(state => state.stage)
  const renderingSize = useGeneralStore(state => state.renderingSize)

  const drawingAnnotation = useAnnotationStore(state => state.drawingAnnotation)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  
  const scale = stage ? stage.scaleX() : 1
  const imageWidth = get(renderingSize, 'width', 1)
  const imageHeight = get(renderingSize, 'height', 1)

  const groupRef = React.useRef(null)


  const isDrawing = (drawingAnnotation && drawingAnnotation.id === id)
  const isSelected = (annotationObjectId === selectedObjectId)
  const isCutting = polygon.isCutting

  const handleSelectPolygon = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id, annotationObjectId })
  }

  const onDragPolygonStart = () => {
    setIsDraggingPolygon(true)
  }

  const onDragPolygonMove = event => {
    const dX = event.target.x() / imageWidth
    const dY = event.target.y() / imageHeight

    EventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      x: dX,
      y: dY,
    })
  }

  const onDragPolygonEnd = (event) => {
    const dX = event.target.x() / imageWidth
    const dY = event.target.y() / imageHeight

    const polys = cloneDeep(polygon.polys)

    EventCenter.emitEvent(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)({
      polys: polys.map(poly => poly.map(p => [p[0] + dX, p[1] + dY])),
      x: 0,
      y: 0
    })

    setIsDraggingPolygon(false)
  }

  const handleStartDraggingMainPoint = event => {
    const key = event.target.key;

    if (!draggingPointKey) {
      setDraggingPointKey(key)
    }
  }

  const handleMoveDraggingMainPoint = (event, polyIndex, pointIndex) => {
    const target = event.target
    const key = target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x / imageWidth, event.target.attrs.y / imageHeight];

    const newPolys = cloneDeep(polygon.polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
      }
    })
    EventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      polys: newPolys,
    })
  }

  const handleEndDraggingMainPoint = (event) => {
    EventCenter.emitEvent(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)({})
    setDraggingPointKey(null)
  }

  const getNewPolysAfterDraggingMidPoint = (polys, { polyIndex, pointIndex, position }) => {
    const newPolys = cloneDeep(polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex + 1), position, ...poly.slice(pointIndex + 1)]
      }
    })

    return newPolys
  }

  const handleStartDraggingMidPoint = (event) => {
    const key = event.target.key;

    if (!draggingPointKey) {
      setDraggingPointKey(key)
    }
  }

  const handleMoveDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const key = event.target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }

    setDraggingMidPoint({
      position: [event.target.attrs.x / imageWidth, event.target.attrs.y / imageHeight],
      polyIndex,
      pointIndex,
    })
  }

  const handleEndDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const position = [event.target.attrs.x / imageWidth, event.target.attrs.y / imageHeight];

    const newPolys = getNewPolysAfterDraggingMidPoint(polygon.polys, {
      polyIndex,
      pointIndex,
      position
    })

    EventCenter.emitEvent(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)({
      polys: newPolys,
    })

    setDraggingPointKey(null)
    setDraggingMidPoint(null)
  }

  const handleClickMainPoint = (event) => {
    // prevent trigger stage click which stops double click
    if (!isDrawing && !isCutting) { // for clicking start point to end
      event.cancelBubble = true
    }
  }

  const handleDoubleClickDeletePoint = (event, polyIndex, pointIndex) => {
    event.cancelBubble = true
    let newPolys = cloneDeep(polygon.polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex), ...poly.slice(pointIndex + 1)]
      }
    }).filter(poly => poly.length >= 3)

    EventCenter.emitEvent(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)({
      polys: newPolys,
    })
  }


  const handleContextMenu = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)({
      e,
      id
    })
  }

  return (
    <Group
      id={id}
      ref={groupRef}
    >
      <PolygonPath
        id={id}
        polygon={{
          ...polygon,
          polys: draggingMidPoint ?
            getNewPolysAfterDraggingMidPoint(polygon.polys, draggingMidPoint)
            : polygon.polys
        }}
        properties={properties}
        scale={scale}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        isSelected={isSelected}
        isDrawing={isDrawing}
        isCutting={isCutting}
        handleSelectPolygon={handleSelectPolygon}
        handleContextMenu={handleContextMenu}
        onDragPolygonStart={onDragPolygonStart}
        onDragPolygonMove={onDragPolygonMove}
        onDragPolygonEnd={onDragPolygonEnd}
      />
      {(!isDraggingPolygon && (isDrawing || isSelected)) &&
        <PolygonMainPoints
          isDrawing={isDrawing}
          isSelected={isSelected}
          isCutting={isCutting}
          id={id}
          polygon={polygon}
          scale={scale}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          handleStartDraggingMainPoint={handleStartDraggingMainPoint}
          handleMoveDraggingMainPoint={handleMoveDraggingMainPoint}
          handleEndDraggingMainPoint={handleEndDraggingMainPoint}
          handleClickMainPoint={handleClickMainPoint}
          handleDoubleClickDeletePoint={handleDoubleClickDeletePoint}
        />
      }
      {(!isDrawing && !isDraggingPolygon && isSelected && !isCutting) &&
        <PolygonMidPoints
          id={id}
          polygon={polygon}
          scale={scale}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          isSelected={isSelected}
          handleStartDraggingMidPoint={handleStartDraggingMidPoint}
          handleMoveDraggingMidPoint={handleMoveDraggingMidPoint}
          handleEndDraggingMidPoint={handleEndDraggingMidPoint}
        />
      }
    </Group>
  )
}

export default Polygon