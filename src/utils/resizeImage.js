const resizeImage = (imgData, { maxWidth, maxHeight }, forceSize = false) => new Promise((resolve, reject) => {
  let image = new Image();
  image.onload = function () {
    // Resize the image
    let canvas = document.createElement('canvas'),
      width = image.width,
      height = image.height;

    if (!forceSize) { // one dimension reach max value
      if ((width / height) > (maxWidth / maxHeight)) {
        height *= maxWidth / width
        width = maxWidth;
      } else {
        width *= maxHeight / height;
        height = maxHeight;
      }
    } else { // both width and height must become max values
      width = maxWidth
      height = maxHeight
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    let resizedImage = canvas.toDataURL('image/jpeg');
    resolve({
      originalImg: imgData,
      originalWidth: image.width,
      originalHeight: image.height,
      img: resizedImage,
      width,
      height,
    })
  }
  image.onerror = reject

  image.src = imgData
})

export default resizeImage
