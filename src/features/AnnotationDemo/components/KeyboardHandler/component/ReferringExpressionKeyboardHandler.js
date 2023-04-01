import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const ReferringExpressionKeyboardHandler = (props) => {
  return (
    <>
      {/* Handle key enter: predict mask */}
      <KeyboardEventHandler
        handleKeys={['enter', 'ctrl+enter']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)}
      />
      {/* Handle key Esc: unselect object*/}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)}
      />
    </>
  )
}

export default ReferringExpressionKeyboardHandler