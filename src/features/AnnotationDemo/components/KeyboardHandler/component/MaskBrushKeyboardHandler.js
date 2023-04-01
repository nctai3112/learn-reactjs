import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const MaskBrushKeyboardHandler = (props) => {
  return (
    <>
      {/* Handle key Esc: unselect object*/}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)}
      />
      <KeyboardEventHandler
        handleKeys={['shift+p']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_POSITIVE_BRUSH)}
      />
      <KeyboardEventHandler
        handleKeys={['shift+n']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK_BRUSH.CHOOSE_NEGATIVE_BRUSH)}
      />
    </>
  )
}

export default MaskBrushKeyboardHandler