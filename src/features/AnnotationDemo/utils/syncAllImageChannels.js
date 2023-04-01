/*global cv*/
/*eslint no-undef: "error"*/

const syncAllImageChannels = (base64, options) => new Promise((resolve, reject) => {
  if (!base64) {
    resolve(null)
  }
  try {
    const { canvasWidth, canvasHeight } = options

    let tmpCanvas = document.createElement("canvas")
    tmpCanvas.setAttribute("id", "tmpCanvas")
    tmpCanvas.setAttribute("width", canvasWidth)
    tmpCanvas.setAttribute("height", canvasHeight)
    let ctx = tmpCanvas.getContext('2d')

    var image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      let img = cv.matFromImageData(imgData);
      
      if (img.isContinuous()) {
        for (let col = 0; col < img.cols; ++col) {
          for (let row = 0; row < img.rows; ++row) {
            let R = img.data[row * img.cols * img.channels() + col * img.channels()];
            img.data[row * img.cols * img.channels() + col * img.channels() + 1] = R;
            img.data[row * img.cols * img.channels() + col * img.channels() + 2] = R;
            img.data[row * img.cols * img.channels() + col * img.channels() + 3] = R;
          }
        }
      }

      let thresholdImgData = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows)
      ctx.putImageData(thresholdImgData, 0, 0);

      let resBase64 = tmpCanvas.toDataURL();
      resolve(resBase64)

      tmpCanvas.remove()
      img.delete()
    };
    image.src = base64
  } catch (error) {
    reject(error)
  }
})

export default syncAllImageChannels