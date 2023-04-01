import React from 'react'
import { Circle } from 'react-konva'

import { useGeneralStore } from '../../../../stores/index'

import { COLOR_BY_SCRIBBLE_TYPE } from '../../../../constants'

const DrawScribbleToMask = () => {
  const getToolConfig = useGeneralStore(state => state.getToolConfig)
  const currentMousePosition = useGeneralStore(state => state.currentMousePosition)

  const toolConfig = getToolConfig()

  return (
    <Circle
      x={currentMousePosition.x}
      y={currentMousePosition.y}
      radius={toolConfig.scribbleSize / 2}
      fill={COLOR_BY_SCRIBBLE_TYPE[toolConfig.scribbleType]}
      opacity={0.5}
    />
  )
}

export default DrawScribbleToMask