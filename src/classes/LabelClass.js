export default class LabelClass {
  constructor(labelId = '', label = '', projectId = '', properties = {}, annotationProperties = {}) {
    this.id = labelId
    this.label = label
    this.projectId = projectId
    this.properties = properties
    this.annotationProperties = annotationProperties
  }

  static constructorFromServerData(data) {
    return new LabelClass(
      data.id,
      data.label,
      data.project,
      data.properties,
      data.annotation_properties
    )
  }

  set updateProperties(properties) {
    this.properties = {
      ...this.properties,
      ...properties
    }
  }
  set updateAnnotationProperties(annotationProperties) {
    this.annotationProperties = {
      ...this.annotationProperties,
      ...annotationProperties,
    }
  }
}