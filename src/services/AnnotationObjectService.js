import RestConnector from '../connectors/RestConnector'

import AnnotationObjectClass from '../classes/AnnotationObjectClass'


class AnnotationObjectService {
  async getAnnotationObjectsByDataInstance(dataInstanceId) {
    return RestConnector.get(`/annotation_objects?data_instance_id=${dataInstanceId}`)
      .then(response => 
        response.data.map(annotationObjectData => AnnotationObjectClass.constructorFromServerData(annotationObjectData))
      )
  }

  async postAnnotationObject(annotationObject) {
    const updateData = {
      id: annotationObject.id,
      data_instance_id: annotationObject.dataInstanceId,
      annotation_type: annotationObject.annotationType,
      properties: annotationObject.properties,
      attributes: annotationObject.attributes
    }
    if (annotationObject.labelId) {
      updateData.label_id = annotationObject.labelId
    }
    return await RestConnector.post('/annotation_objects', updateData)
  }

  async deleteAnnotationObjectById(id) {
    return RestConnector.delete(`/annotation_objects?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new AnnotationObjectService()