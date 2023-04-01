import React from 'react'
import { Circle } from 'react-konva'

const PolygonMidPoints = (props) => {
  const {
    id,
    polygon,
    scale,
    imageWidth,
    imageHeight,
    
    handleStartDraggingMidPoint,
    handleMoveDraggingMidPoint,
    handleEndDraggingMidPoint,
  } = props

  const { x: dX, y: dY } = polygon

  const calculateMidPoints = (polys) => {
    return polys.map(poly => poly.map((curPoint, index) => {
      const nextPoint = poly[(index + 1) % poly.length]
      return [
        (curPoint[0] + nextPoint[0]) / 2,
        (curPoint[1] + nextPoint[1]) / 2,
      ]
    }))
  }

  const polysMidPoints = calculateMidPoints(polygon.polys)

  return (polysMidPoints.map((midPoints, polyIndex) => {
    return (
      midPoints.map((point, pointIndex) => {
        const x = (point[0] + dX) * imageWidth;
        const y = (point[1] + dY) * imageHeight;
        return (
          <Circle
            key={`poly-midpoint-${id}-${polyIndex}-${pointIndex}`}
            x={x}
            y={y}
            radius={5 / scale}
            fill="white"
            stroke="black"
            opacity={0.8}
            strokeWidth={2 / scale}
            onDragStart={handleStartDraggingMidPoint}
            onDragMove={(e) => handleMoveDraggingMidPoint(e, polyIndex, pointIndex)}
            onDragEnd={(e) => handleEndDraggingMidPoint(e, polyIndex, pointIndex)}
            draggable
          />
        );
      })
    )
  })
  )
}

export default PolygonMidPoints