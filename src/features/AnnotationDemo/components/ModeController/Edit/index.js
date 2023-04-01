import React from 'react'

import EventCenter from '../../../EventCenter'
import { useAnnotationStore } from '../../../stores/index'

import { EVENT_TYPES } from '../../../constants';

const Edit = (props) => {
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)

  const handleSelectAnnotation = ({e, annotationObjectId }) => {
    e.cancelBubble = true
    setSelectedObjectId(annotationObjectId)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.SELECT_ANNOTATION]: getSubject(EVENT_TYPES.SELECT_ANNOTATION)
        .subscribe({ next: (e) => handleSelectAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return null
}

export default Edit