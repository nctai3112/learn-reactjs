import React from 'react'
import { Layer } from 'react-konva'
import { filter, cloneDeep, get, find } from 'lodash'

import BBoxAnnotation from '../../../../../classes/BBoxAnnotationClass'
import PolygonAnnotation from '../../../../../classes/PolygonAnnotationClass'
import MaskAnnotation from '../../../../../classes/MaskAnnotationClass'

import BBox from './components/BBox/BBox'
import Polygon from './components/Polygon/Polygon'
import Mask from './components/Mask/MaskAnnotation'

import { useGeneralStore, useDatasetStore, useAnnotationStore } from '../../../stores/index'


const mapAnnotationClassToRender = [
  {
    cls: BBoxAnnotation,
    render: BBox,
  },
  {
    cls: PolygonAnnotation,
    render: Polygon,
  },
  {
    cls: MaskAnnotation,
    render: Mask,
  },
]


const AnnotationRender = (props) => {
  const renderingSize = useGeneralStore(state => state.renderingSize)

  const currentAnnotationImageId = useDatasetStore(state => state.currentAnnotationImageId)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)


  const annotations = useAnnotationStore(state => state.annotations[currentAnnotationImageId] || [])

  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  const drawingAnnotation = useAnnotationStore(state => state.drawingAnnotation)
  const labels = useAnnotationStore(state => state.labels)

  let renderingAnnotations = [...annotations, drawingAnnotation].map((ann) => {
    if (ann === null) {
      return null
    }
    let renderAnn = cloneDeep(ann)
    const annObject = find(annotationObjects, { id: renderAnn.annotationObjectId })
    if (!annObject) {
      return null
    }

    const label = find(labels, { id: annObject.labelId })

    const labelAnnotationProperties = get(label, 'annotationProperties', {})
    renderAnn.annotationType = annObject.annotationType
    renderAnn.properties = {
      ...annObject.properties,
      ...labelAnnotationProperties,
      isHidden: get(label, 'properties.isHidden', false) || get(annObject, 'properties.isHidden', false)
    }
    return renderAnn
  })

  let Layer1 = []
  let Layer2 = []

  // filter out hidden annotations and null drawingAnnotation
  renderingAnnotations = filter(renderingAnnotations, (ann) => ann && !ann?.properties?.isHidden)
  renderingAnnotations.forEach(ann => {
    const renderer = find(mapAnnotationClassToRender, (value => ann instanceof value.cls))
    if (renderer) {
      const RenderComponent = renderer.render
      if (ann.annotationObjectId === selectedObjectId) {
        Layer2.push(
          <RenderComponent
            key={`annotation-${ann.id}`}
            annotation={ann}
            renderingSize={renderingSize}
          />
        )
      } else {
        Layer1.push(
          <RenderComponent
            key={`annotation-${ann.id}`}
            annotation={ann}
            renderingSize={renderingSize}
          />
        )
      }
    }
  })
  return ([
    (!selectedObjectId) && // TODO: check this condition is suitable or only not listening
    <Layer key="all-annotations">
      {Layer1}
    </Layer>,
    <Layer key="drawing-annotations">
      {Layer2}
    </Layer>
  ])
}

export default AnnotationRender