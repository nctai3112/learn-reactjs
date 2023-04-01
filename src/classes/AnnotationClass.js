import generateNewUid from "../utils/uidGenerator"

export default class Annotation {
  constructor(id = '', annotationObjectId, annotationImageId, keyFrame=false) {
    this.id = id || generateNewUid()
    this.annotationObjectId = annotationObjectId
    this.annotationImageId = annotationImageId
    this.keyFrame = keyFrame
  }

  async applyUpdateAnnotation() {
    // abstract function to be implemented in child classes
  }
}