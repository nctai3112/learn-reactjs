import React from 'react'
import { get } from 'lodash'

import { useGeneralStore } from '../../../stores/index'

import DrawMaskBrush from './DrawMaskBrush/index'
import DrawMask from './DrawMask/index'

import { MODES } from '../../../constants'

const mapActiveModeToToolRender = {
  [MODES.DRAW_MASK_BRUSH.name]: DrawMaskBrush,
  [MODES.DRAW_MASK.name]: DrawMask
}


const ToolRender = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const ActiveToolRenderComponent = get(mapActiveModeToToolRender, activeMode, null)

  if (!ActiveToolRenderComponent) {
    return null
  }

  return (
    <ActiveToolRenderComponent/>
  )
}

export default ToolRender