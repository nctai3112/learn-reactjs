import RestConnector from '../connectors/RestConnector'

import BBoxAnnotationClass from '../classes/BBoxAnnotationClass'
import PolygonAnnotationClass from '../classes/PolygonAnnotationClass'
import MaskAnnotationClass from '../classes/MaskAnnotationClass'


class AnnotationService {
  async parseAnnotationObj(ann) {
    switch (ann._cls) {
      case "Annotation.BBoxAnnotation":
        return BBoxAnnotationClass.constructorFromServerData(ann)
      case "Annotation.PolygonAnnotation":
        return PolygonAnnotationClass.constructorFromServerData(ann)
      case "Annotation.MaskAnnotation":
        return await MaskAnnotationClass.constructorFromServerData(ann)
      default:
        return {}
    }
  }

  async getAnnotationsByDataInstance(dataInstanceId) {
    const annotationResponse = await RestConnector.get(`/annotations?data_instance_id=${dataInstanceId}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => await this.parseAnnotationObj(ann)))

    return annotationsObj
  }

  async getAnnotationByAnnotationObject(annotationObjectId) {
    const annotationResponse = await RestConnector.get(`/annotations?annotation_object_id=${annotationObjectId}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => await this.parseAnnotationObj(ann)))

    return annotationsObj
  }

  async deleteAnnotationById(id) {
    return RestConnector.delete(`/annotations?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new AnnotationService()