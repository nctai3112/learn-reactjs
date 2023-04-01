import generateNewUid from '../utils/uidGenerator'

export default class AnnotationObjectClass {
  constructor(id = '', dataInstanceId = '', labelId = '', annotationType, properties = {}, attributes = {}) {
    this.id = id || generateNewUid()
    this.dataInstanceId = dataInstanceId
    this.labelId = labelId
    this.annotationType = annotationType

    this.properties = {
      ...properties,
      isHidden: false
    }
    this.attributes = {
      referringExpression: '',
      ...attributes
    }
  }

  set updateLabel(labelId) {
    this.labelId = labelId
  }

  set updateProperties(newProperties) {
    this.properties = {
      ...this.properties,
      ...newProperties,
    }
  }

  set updateAttributes(newAttributes) {
    this.attributes = {
      ...this.attributes,
      ...newAttributes,
    }
  }

  static constructorFromServerData(data) {
    return new AnnotationObjectClass(
      data.id,
      data.data_instance,
      data.label,
      data.annotation_type,
      data.properties,
      data.attributes
    )
  }
}