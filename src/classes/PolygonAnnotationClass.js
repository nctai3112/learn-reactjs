import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from "../constants/constants";

export default class PolygonAnnotation extends Annotation {
  constructor(id, annotationObjectId, annotationImageId, polygon, keyFrame=false) {
    super(id, annotationObjectId, annotationImageId, keyFrame)

    this.type = ANNOTATION_TYPE.POLYGON
    this.polygon = polygon
  }
  /**
   * polys: array of polygon
   */
  set updateData(newPolygon) {
    this.polygon = {
      ...this.polygon,
      ...newPolygon,
    }
  }
  static constructorFromServerData(data) {
    return new PolygonAnnotation(
      data.id,
      data.annotation_object,
      data.annotation_image,
      {
        x: 0,
        y: 0,
        polys: data.polys
      },
      data.key_frame
    )
  }

  async applyUpdate() {
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotationObjectId,
      annotation_image_id: this.annotationImageId,
      annotation_type: ENUM_ANNOTATION_TYPE.POLYGON,
      key_frame: this.keyFrame,
      data: {
        polys: this.polygon.polys,
      }
    })
  }
}