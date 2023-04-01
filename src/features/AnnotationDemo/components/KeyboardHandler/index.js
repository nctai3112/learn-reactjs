import React from 'react'
import { get } from 'lodash'

import { useGeneralStore } from '../../stores'

import GeneralKeyboardHandler from './component/GeneralKeyboardHandler'
import MaskBrushKeyboardHandler from './component/MaskBrushKeyboardHandler'
import MaskKeyboardHandler from './component/MaskKeyboardHandler'
import EditKeyboardHandler from './component/EditKeyboardHandler'
import BBoxKeyboardHandler from './component/BBoxKeyboardHandler'
import PolygonKeyboardHandler from './component/PolygonKeyboardHandler'
import ReferringExpressionKeyboardHandler from './component/ReferringExpressionKeyboardHandler'

import { MODES } from '../../constants'

const mapModeToKeyboardHandler = {
  [MODES.EDIT.name]: EditKeyboardHandler,
  [MODES.DRAW_BBOX.name]: BBoxKeyboardHandler,
  [MODES.DRAW_POLYGON.name]: PolygonKeyboardHandler,
  [MODES.DRAW_MASK_BRUSH.name]: MaskBrushKeyboardHandler,
  [MODES.DRAW_MASK.name]: MaskKeyboardHandler,
  [MODES.REFERRING_EXPRESSION.name]: ReferringExpressionKeyboardHandler,
}

const KeyboardHandler = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const ActiveKeyboardHandlerComponent = get(mapModeToKeyboardHandler, activeMode, null)

  if (!ActiveKeyboardHandlerComponent) {
    return null
  }

  return ([
    <GeneralKeyboardHandler key="general" {...props}/>,
    ActiveKeyboardHandlerComponent && <ActiveKeyboardHandlerComponent key="tools" {...props} />
  ])
}

export default KeyboardHandler