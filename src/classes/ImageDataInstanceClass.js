import DataInstanceClass from './DataInstanceClass'
import ImageClass from './ImageClass'
import StorageFileClass from './StorageFileClass'


export default class ImageDataInstanceClass extends DataInstanceClass {
  static _cls = "ImageDataInstance"

  constructor(id, name = '', thumbnail, image, otherData) {
    const { width, height, ...others } = otherData

    super(id, name, thumbnail, width, height, others)

    this.image = image
  }

  getCurrentImage() {
    return this.image
  }

  static constructorFromServerData(data) {
    const { id, name, image, thumbnail, ...others } = data 
    return new ImageDataInstanceClass(
      id,
      name,
      StorageFileClass.constructorFromServerData(thumbnail),
      ImageClass.constructorFromServerData(image),
      others
    )
  }
}