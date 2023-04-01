import React from 'react'
import { Circle } from 'react-konva'

import EventCenter from '../../../../../EventCenter'

import { EVENT_TYPES } from '../../../../../constants'


const PolygonMainPoints = (props) => {
  const {
    id,
    polygon,
    imageWidth,
    imageHeight,
    isDrawing,
    isSelected,
    isCutting,
    scale,
    handleStartDraggingMainPoint,
    handleMoveDraggingMainPoint,
    handleEndDraggingMainPoint,
    handleClickMainPoint,
    handleDoubleClickDeletePoint,
  } = props

  const { polys, x: dX, y: dY } = polygon

  const handleMouseOverStartPoint = (event, polyIndex) => {
    if (polys[polyIndex].length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    event.target.zIndex(1000)

    EventCenter.emitEvent(EVENT_TYPES.MOUSE_OVER_POLYGON_START)(true)
  }

  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });

    EventCenter.emitEvent(EVENT_TYPES.MOUSE_OVER_POLYGON_START)(false)
  }

  return (polys.map((mainPoints, polyIndex) => {
    const isActivePoly = (isDrawing && polyIndex === 0) || (isCutting && polyIndex === polys.length - 1)

    return (mainPoints.map((point, pointIndex) => {
      const x = (point[0] + dX) * imageWidth;
      const y = (point[1] + dY) * imageHeight;
      const startPointAttr =
        (pointIndex === 0 && isActivePoly)
          ? {
            hitStrokeWidth: 6 / scale,
            onMouseOver: (e) => handleMouseOverStartPoint(e, polyIndex),
            onMouseOut: handleMouseOutStartPoint,
            onTap: (e) => handleMouseOverStartPoint(e, polyIndex),
            fill: "red",
            hitFunc: function (context) {
              context.beginPath();
              context.arc(0, 0, 6 / scale, 0, Math.PI * 2, true);
              context.closePath();
              context.fillStrokeShape(this);
            },
          }
          : {
            scale: { x: 1, y: 1 }
          };
      return (
        <Circle
          key={`poly-main_points-${id}-${polyIndex}-${pointIndex}`}
          x={x}
          y={y}
          radius={6 / scale}
          fill="white"
          stroke="black"
          strokeWidth={2 / scale}
          hitFunc={(isDrawing || isCutting) && function () {
            // disable hitFunc while drawing or cutting or dragging viewport
          }}
          {...startPointAttr}
          draggable={isSelected && !isDrawing && !isCutting}
          onDragStart={handleStartDraggingMainPoint}
          onDragMove={(e) => handleMoveDraggingMainPoint(e, polyIndex, pointIndex)}
          onDragEnd={handleEndDraggingMainPoint}
          onClick={isSelected ? handleClickMainPoint : null}
          onTap={isSelected ? handleClickMainPoint : null}
          onDblClick={isSelected ? (e) => handleDoubleClickDeletePoint(e, polyIndex, pointIndex) : null}
          onDblTap={isSelected ? (e) => handleDoubleClickDeletePoint(e, polyIndex, pointIndex) : null}
        />
      );
    }))
  })
  )
}

export default PolygonMainPoints