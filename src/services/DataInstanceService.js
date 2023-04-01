import RestConnector from '../connectors/RestConnector'

import ImageDataInstanceClass from '../classes/ImageDataInstanceClass'
import VideoDataInstanceClass from '../classes/VideoDataInstanceClass'


class DataInstanceService {
  async parseDataInstanceFromServer(instance) {
    if (instance._cls.includes(ImageDataInstanceClass._cls))
      return ImageDataInstanceClass.constructorFromServerData(instance)
    if (instance._cls.includes(VideoDataInstanceClass._cls))
      return VideoDataInstanceClass.constructorFromServerData(instance)
    return {}
  }

  async getDataInstancesByDataset(datasetId, page = 1, per_page = 50) {
    const dataInstancesResponse = await RestConnector.get(`/data?dataset_id=${datasetId}&page=${page}&per_page=${per_page}`)

    const dataInstancesObj = await Promise.all(dataInstancesResponse.data.map(instance => this.parseDataInstanceFromServer(instance)))

    return dataInstancesObj
  }

  async deleteDataById(id) {
    return RestConnector.delete(`/data?id=${id}`)
      .then((response) => {
        return response.data
      })
  }

  upload(file, datasetId, onUploadProgress) {
    let formData = new FormData();

    formData.append("dataset_id", datasetId);
    
    let uploadURL = "/data/upload_image"
    if (file.type.includes("image")) {
      formData.append("image", file);
      uploadURL = "/data/upload_image"
    } else {
      formData.append("video", file);
      uploadURL = "/data/upload_video"
    }

    return RestConnector.post(uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }).then(response => {
      const data = response.data
      return this.parseDataInstanceFromServer(data)
    })
  }
}

export default new DataInstanceService()