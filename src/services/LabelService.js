import LabelClass from '../classes/LabelClass'

import RestConnector from '../connectors/RestConnector'

class LabelService {
  getLabelByProject(projectId) {
    return RestConnector.get(`/annotation_labels?project_id=${projectId}`)
      .then(response => response.data.map(label => LabelClass.constructorFromServerData(label)))
  }

  getLabelByDataset(datasetId) {
    return RestConnector.get(`/annotation_labels?dataset_id=${datasetId}`)
      .then(response => response.data.map(label => LabelClass.constructorFromServerData(label)))
  }

  createLabel(data) {
    return RestConnector.post('/annotation_labels', {
      label: data.label,
      project_id: data.projectId,
      properties: data.properties,
      annotation_properties: data.annotationProperties
    }).then(response => LabelClass.constructorFromServerData(response.data))
  }

  updateLabel(data) {
    return RestConnector.put('/annotation_labels', {
      id: data.id,
      label: data.label,
      properties: data.properties,
      annotation_properties: data.annotationProperties
    }).then(response => LabelClass.constructorFromServerData(response.data))
  }

  deleteLabelById(id) {
    return RestConnector.delete(`/annotation_labels?id=${id}`)
  }
}

export default new LabelService()