import React from 'react'
import { Group } from 'react-konva'
import { get } from 'lodash'

import EventCenter from '../../../../../EventCenter'
import { useGeneralStore, useAnnotationStore } from '../../../../../stores/index'

import Scribble from './Scribble'
import Mask from './Mask'
import Brush from './Brush'

import { MODES ,EVENT_TYPES } from '../../../../../constants'

const MaskAnnotation = (props) => {
  const { annotation, renderingSize } = props

  const activeMode = useGeneralStore(state => state.activeMode)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)

  const { id, annotationObjectId, properties, maskData } = annotation

  const imageWidth = get(renderingSize, 'width', 1)
  const imageHeight = get(renderingSize, 'height', 1)

  const isSelected = (annotationObjectId === selectedObjectId)

  const { mask, scribbles, maskBrushes, threshold } = maskData
  const displayMask = get(mask, 'bitmap', null)
  
  let color = get(properties, 'fill', '')
  let opacity = get(properties, 'opacity', 0.2)

  const handleSelectMask = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id, annotationObjectId })
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
    >
      {activeMode === MODES.DRAW_MASK.name && isSelected && scribbles &&
        scribbles.map((scribble, index) =>
          <Scribble
            key={`scribble-${id}-${index}`} scribble={scribble}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        )
      }
      <Mask
        isSelected={isSelected}
        maskBmp={displayMask}
        color={color}
        opacity={opacity}
        handleSelectMask={handleSelectMask}
        handleContextMenu={handleContextMenu}
        threshold={threshold}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      />
      {
        maskBrushes.map((scribble, index) =>
          <Brush
            key={`scribble-${id}-${index}`} 
            isSelected={isSelected}
            scribble={scribble}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            color={color}
            opacity={opacity}
            handleSelectMask={handleSelectMask}
            handleContextMenu={handleContextMenu}
          />
        )
      }
    </Group>
  )
}

export default MaskAnnotation