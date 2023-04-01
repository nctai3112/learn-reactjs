export default class DataInstanceClass {
  constructor(id, name = '', thumbnail, width = 0, height = 0, otherData) {
    this.id = id
    this.name = name
    this.thumbnail = thumbnail
    this.width = width
    this.height = height

    Object.keys(otherData).forEach(key => this[key] = otherData[key])
  }
}
