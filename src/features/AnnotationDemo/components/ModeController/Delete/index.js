import React from 'react'

import Cursor from '../Cursor/index'

import { EVENT_TYPES } from '../../../constants';

const Delete = (props) => {
  const { useStore, eventCenter } = props
  const deleteAnnotation = useStore(state => state.deleteAnnotation)

  const handleDeleteAnnotation = ({ e, id: annotationId }) => {
    e.cancelBubble = true

    deleteAnnotation(annotationId)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.SELECT_ANNOTATION]: getSubject(EVENT_TYPES.SELECT_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])


  return (
    <Cursor {...props}/>
  )
}

export default Delete