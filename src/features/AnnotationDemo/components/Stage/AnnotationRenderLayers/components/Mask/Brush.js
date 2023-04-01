import React from 'react'
import { Group, Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../../utils/pointArrayToFlattenPointArray'
import { SCRIBBLE_TYPES } from '../../../../../constants'

const Brush = (props) => {
  const { isSelected, scribble, imageWidth, imageHeight, color, opacity } = props

  const {
    type, points, strokeWidth,
    ...others
  } = scribble


  const flattenPoints = pointArrayToFlattenPointArray(points, imageWidth, imageHeight)
  const strokeColor = color

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
        globalCompositeOperation={type === SCRIBBLE_TYPES.NEGATIVE ? 'destination-out' : undefined}
        opacity={isSelected ? opacity + 0.2 : opacity}
        stroke={strokeColor}
        listening={false}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  )
}

export default Brush