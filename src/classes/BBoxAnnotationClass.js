import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class BBoxAnnotation extends Annotation {
  constructor(id, annotationObjectId, annotationImageId, bBox, keyFrame=false) {
    super(id, annotationObjectId, annotationImageId, keyFrame)

    this.type = ANNOTATION_TYPE.BBOX
    this.bBox = bBox
  }
  /**
   * x, y
   * width, height
   */
  set updateData(data) {
    this.bBox = {
      ...this.bBox,
      ...data
    }
  }
  static constructorFromServerData(data) {
    return new BBoxAnnotation(
      data.id,
      data.annotation_object,
      data.annotation_image,
      {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      },
      data.key_frame
    )
  }

  async applyUpdate() {
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotationObjectId,
      annotation_image_id: this.annotationImageId,
      annotation_type: ENUM_ANNOTATION_TYPE.BBOX,
      key_frame: this.keyFrame,
      data: this.bBox
    })
  }
}