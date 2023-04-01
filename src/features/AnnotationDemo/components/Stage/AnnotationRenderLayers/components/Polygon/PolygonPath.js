import React from 'react'
import { Path } from 'react-konva'

import polysToSvgPathData from '../../../../../utils/polysToSvgPathData'

const PolygonPath = (props) => {
  const {
    id,
    polygon,
    properties,
    scale,
    imageWidth,
    imageHeight,

    isSelected,
    isDrawing,
    isCutting,
    handleSelectPolygon,
    handleContextMenu,
    onDragPolygonStart,
    onDragPolygonMove,
    onDragPolygonEnd,
  } = props


  const polys = polygon.polys

  const pathRef = React.useRef(null)

  const pathData = polysToSvgPathData(polys, imageWidth, imageHeight)
  return (
    <Path
      ref={pathRef}
      id={id}
      data={pathData}
      hitFunc={(isCutting) && function () {
        // disable hitFunc while dragging viewport or cutting
      }}
      x={polygon.x * imageWidth}
      y={polygon.y * imageHeight}
      {...properties}
      strokeWidth={properties.strokeWidth / scale}
      opacity={isSelected ? properties.opacity + 0.2 : properties.opacity}
      draggable={isSelected && !isDrawing}
      onClick={handleSelectPolygon}
      onTap={handleSelectPolygon}
      onContextMenu={handleContextMenu}
      onDragStart={onDragPolygonStart}
      onDragMove={onDragPolygonMove}
      onDragEnd={onDragPolygonEnd}
    />
  )
}

export default PolygonPath