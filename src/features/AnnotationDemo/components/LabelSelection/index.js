import React from 'react'

import LabelSelectionPopover from './components/LabelSelectionPopover'

import { EVENT_TYPES } from '../../constants'

const LabelSelection = (props) => {
  const { useStore, eventCenter } = props

  const [isOpenLabelSelection, setIsOpenLabelSelection] = React.useState(false)
  const setEditingAnnotationLabelId = useStore(state => state.setEditingAnnotationLabelId)
  const getEditingAnnotationId = useStore(state => state.getEditingAnnotationId)
  const setEditingAnnotationId = useStore(state => state.setEditingAnnotationId)
  const currentMousePosition = useStore(state => state.currentMousePosition)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const labels = useStore(state => state.labels)

  const handleFinishAnnotation = (annotationId) => {
    updateCurrentMousePosition()
    setEditingAnnotationId(annotationId)
    setIsOpenLabelSelection(true)
  }

  const handleSelectLabel = (newLabelId) => {
    setEditingAnnotationLabelId(newLabelId)
  }

  const handleClose = () => {
    setEditingAnnotationId(null)
    setIsOpenLabelSelection(false)
  }

  const handleContextMenuAnnotation = ({ e, id: annotationId }) => {
    e.evt.preventDefault()

    if (annotationId !== getEditingAnnotationId()) {
      return
    }

    updateCurrentMousePosition()
    setIsOpenLabelSelection(true)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.FINISH_ANNOTATION]: getSubject(EVENT_TYPES.FINISH_ANNOTATION)
        .subscribe({ next: (annotationId) => handleFinishAnnotation(annotationId) }),
      [EVENT_TYPES.CONTEXT_MENU_ANNOTATION]: getSubject(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)
        .subscribe({ next: (e) => handleContextMenuAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    isOpenLabelSelection ?
      <LabelSelectionPopover
        contextMenuPosition={currentMousePosition}
        labels={labels}
        handleSelectLabel={handleSelectLabel}
        handleClose={handleClose}
      />
      : null
  )
}

export default LabelSelection