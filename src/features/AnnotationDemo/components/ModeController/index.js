import React, { useEffect } from 'react'
import { find, get } from 'lodash'

import Cursor from './Cursor/index'
import Edit from './Edit/index'
import DrawBBox from './DrawBBox/index'
import DrawPolygon from './DrawPolygon/index'
import DrawMaskBrush from './DrawMaskBrush/index'
import DrawMask from './DrawMask/index'
import ReferringExpression from './ReferringExpression/index'

import { MODES } from '../../constants'
import { ENUM_ANNOTATION_TYPE }from '../../../../constants/constants'

import { useGeneralStore, useAnnotationStore } from '../../stores/index'

const mapModeToComponent = {
  [MODES.CURSOR.name]: Cursor,
  [MODES.EDIT.name]: Edit,
  [MODES.DRAW_BBOX.name]: DrawBBox,
  [MODES.DRAW_POLYGON.name]: DrawPolygon,
  [MODES.DRAW_MASK_BRUSH.name]: DrawMaskBrush,
  [MODES.DRAW_MASK.name]: DrawMask,
  [MODES.REFERRING_EXPRESSION.name]: ReferringExpression,
  // [MODES.CUT_POLYGON.name]: CutPolygon,
  // [MODES.DELETE.name]: Delete,
}

const mapAnnotationTypeToMode = {
  [ENUM_ANNOTATION_TYPE.BBOX]: [MODES.DRAW_BBOX.name],
  [ENUM_ANNOTATION_TYPE.POLYGON]: [MODES.DRAW_POLYGON.name],
  [ENUM_ANNOTATION_TYPE.MASK]: [MODES.DRAW_MASK_BRUSH.name, MODES.DRAW_MASK.name, MODES.REFERRING_EXPRESSION.name],
}

const ModeController = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const setActiveMode = useGeneralStore(state => state.setActiveMode)
  const ActiveModeComponent = get(mapModeToComponent, activeMode, null)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const setDrawingAnnotation = useAnnotationStore(state => state.setDrawingAnnotation)

  const annotationObject = find(annotationObjects, { id: selectedObjectId })

  const checkModeMatchAnnotationType = (annotationType, mode) => {
    return (
      !mapAnnotationTypeToMode[annotationType] ||
      mapAnnotationTypeToMode[annotationType].includes(mode)
    )
  }

  useEffect(() => {
    if (selectedObjectId) {
      if (!checkModeMatchAnnotationType(annotationObject?.annotationType, activeMode)) {
        setActiveMode(mapAnnotationTypeToMode[annotationObject.annotationType][0])
      }
    }
  }, [selectedObjectId])

  useEffect(() => {
    if (!checkModeMatchAnnotationType(annotationObject?.annotationType, activeMode)) {
      setSelectedObjectId(null)
      setDrawingAnnotation(null)
    }
  }, [activeMode])

  return ([
    <Cursor key="cursor-handler" {...props}/>,
    ActiveModeComponent && <ActiveModeComponent key="mode-handler" {...props}/>
  ])
}

export default ModeController