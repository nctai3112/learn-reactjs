import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const GeneralKeyboardHandler = (props) => {
  return (
    <>
      {/* Handle key Esc: unselect object*/}
      <KeyboardEventHandler
        handleKeys={['shift+space']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.VIEW.CENTER_VIEWPOINT)}
      />
    </>
  )
}

export default GeneralKeyboardHandler