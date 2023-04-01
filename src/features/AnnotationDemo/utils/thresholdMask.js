/*global cv*/
/*eslint no-undef: "error"*/

const thresholdMask = (base64, threshold, options) => new Promise((resolve, reject) => {
  if (!base64) {
    resolve(null)
  }
  try {
    const { canvasWidth, canvasHeight, color, makeTransparent } = options

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

      if (threshold) {
        cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(img, img, (threshold / 100) * 255, 255, cv.THRESH_BINARY);
        cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA, 0);
      }

      
      if (img.isContinuous() && (color || makeTransparent)) {
        for (let col = 0; col < img.cols; ++col) {
          for (let row = 0; row < img.rows; ++row) {
            let R = img.data[row * img.cols * img.channels() + col * img.channels()];
            let G = img.data[row * img.cols * img.channels() + col * img.channels() + 1];
            let B = img.data[row * img.cols * img.channels() + col * img.channels() + 2];
            if (!threshold) {
              img.data[row * img.cols * img.channels() + col * img.channels() + 3] = R;
            }
            if (color) {
              img.data[row * img.cols * img.channels() + col * img.channels()] = color.r;
              img.data[row * img.cols * img.channels() + col * img.channels() + 1] = color.g;
              img.data[row * img.cols * img.channels() + col * img.channels() + 2] = color.b;
            }
            if (makeTransparent && R === 0 && G === 0 && B === 0) {
              img.data[row * img.cols * img.channels() + col * img.channels() + 3] = 0;
            }
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

export default thresholdMask