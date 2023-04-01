import React from 'react'
import { Group, Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../../utils/pointArrayToFlattenPointArray'
import { SCRIBBLE_TYPES, COLOR_BY_SCRIBBLE_TYPE } from '../../../../../constants'

const Scribble = (props) => {
  const { scribble, imageWidth, imageHeight, } = props
  
  const { 
    type, points, strokeWidth, 
    ...others 
  } = scribble


  const flattenPoints = pointArrayToFlattenPointArray(points, imageWidth, imageHeight)
  const strokeColor = COLOR_BY_SCRIBBLE_TYPE[type]

  return (
    <Group listening={false}>
      <Line
        points={flattenPoints}
        {...others}
        strokeWidth={strokeWidth}
        globalCompositeOperation={'destination-out'}
        opacity={1}
        stroke={strokeColor}
        listening={false}
        lineCap="round"
        lineJoin="round"
      />
      <Line
        points={flattenPoints}
        {...others}
        strokeWidth={strokeWidth}
        globalCompositeOperation={type === SCRIBBLE_TYPES.ERASER ? 'destination-out' : undefined}
        opacity={type === SCRIBBLE_TYPES.ERASER ? 1 : 0.6}
        stroke={strokeColor}
        listening={false}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  )
}

export default Scribble