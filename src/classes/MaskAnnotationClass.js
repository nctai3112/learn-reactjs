import RestConnector from '../connectors/RestConnector'
import AnnotationClass from "./AnnotationClass";
import StorageFileClass from './StorageFileClass'

import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class MaskAnnotation extends AnnotationClass {
  constructor(id, annotationObjectId, annotationImageId, maskData = {}, keyFrame=false) {
    super(id, annotationObjectId, annotationImageId, keyFrame)

    this.type = ANNOTATION_TYPE.MASK
    this.maskData = {
      maskBrushes: [],
      scribbles: [],
      mask: new StorageFileClass(),
      threshold: 50,
      ...maskData,
    }
    this.isPropagating = false
  }

  set updateData(newData) {
    Object.keys(newData).forEach(key => this.maskData[key] = newData[key])
  }

  async setMask(maskResponse) {
    const maskFile = StorageFileClass.constructorFromServerData(maskResponse)
    await maskFile.getBitmap()
    this.updateData = {
      mask: maskFile
    }
  }

  static async constructorFromServerData(data) {
    const maskFile = StorageFileClass.constructorFromServerData(data.mask)
    await maskFile.getBitmap()
    return new MaskAnnotation(
      data.id,
      data.annotation_object,
      data.annotation_image,
      {
        scribbles: data.scribbles || [],
        mask: maskFile,
        threshold: data.threshold,
      },
      data.key_frame
    )
  }

  async applyUpdate() {
    let data = {
      scribbles: this.maskData.scribbles,
      threshold: this.maskData.threshold,
    }
    if (this.maskData.mask.URL) {
      data.mask = {
        filename: this.maskData.mask.filename,
        URL: this.maskData.mask.URL,
      }
    }

    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotationObjectId,
      annotation_image_id: this.annotationImageId,
      annotation_type: ENUM_ANNOTATION_TYPE.MASK,
      key_frame: this.keyFrame,
      data,
    }).catch(error => console.log(error))
  }
}