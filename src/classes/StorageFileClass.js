export default class StorageFileClass {
  constructor(filename, URL) {
    this.filename = filename
    this.URL = URL
  }

  async getBlob() {
    if (!this.blob) {
      try {
        if (!this.URL) {
          return null
        }
        this.blob = await fetch(this.URL).then(response => response.blob())
      } catch (error) {
        this.blob = null
      }
    }
    return this.blob
  }

  async getBitmap(renderingSize) {
    const canvasRenderingSize = renderingSize || window.canvasRenderingSize
    if (
      !this.bitmap 
      || this.bitmap.width !== canvasRenderingSize.width
      || this.bitmap.height !== canvasRenderingSize.height 
    ) {
      try {
        this.bitmap = await this.getBlob().then(blob => createImageBitmap(blob, {
          resizeWidth: canvasRenderingSize.width,
          resizeHeight: canvasRenderingSize.height,
        })).catch(err => {
          console.log(err)
        })
      } catch (error) {
        this.bitmap = null
      }
    }
    return this.bitmap
  }

  async getBase64() {
    if (!this.base64) {
      try {
        this.base64 = await this.getBlob().then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve( reader.result )
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }))
      } catch (error) {
        this.base64 = null
      }
    }
    return this.base64
  }

  static constructorFromServerData(data) {
    return new StorageFileClass(data?.filename, data?.URL)
  }
}