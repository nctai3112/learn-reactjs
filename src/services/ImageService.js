import { get } from 'lodash'

import RestConnector from '../connectors/RestConnector'

import ImageClass from '../classes/ImageClass'

class ImageService {
  upload(imageFile, datasetId, onUploadProgress) {
    let formData = new FormData();

    formData.append("image", imageFile);
    formData.append("dataset_id", datasetId);

    return RestConnector.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }).then(response => {
      const data = response.data
      return ImageClass.constructorFromServerData(data)
    })
  }

  getImagesByDataset(datasetId, page = 1, per_page = 50) {
    return RestConnector.get(`/images?dataset_id=${datasetId}&page=${page}&per_page=${per_page}`)
      .then((response) => {
        return response.data.map(image => ImageClass.constructorFromServerData(image))
      })
  }

  deleteImageById(imageId) {
    return RestConnector.delete(`/images?id=${imageId}`)
      .then((response) => {
        return response.data
      })
      .catch(err => {
        alert(get(err, 'data.errors[0]', 'Error'))
      })
  }
}

export default new ImageService()