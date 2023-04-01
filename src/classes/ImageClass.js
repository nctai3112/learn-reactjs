import StorageFileClass from './StorageFileClass'

export default class ImageClass {
  /**
   * 
   * @param {String} id 
   * @param {StorageFile} original 
   * @param {StorageFile} thumbnail 
   */
  constructor(id, original, thumbnail) {
    this.id = id
    this.original = original
    this.thumbnail = thumbnail
  }
  
  async getData() {
    await this.original.getBitmap()
    await this.thumbnail.getBitmap()
  }

  static constructorFromServerData(data) {
    return new ImageClass(
      data.id,
      StorageFileClass.constructorFromServerData(data.original),
      StorageFileClass.constructorFromServerData(data.thumbnail)
    )
  }
}