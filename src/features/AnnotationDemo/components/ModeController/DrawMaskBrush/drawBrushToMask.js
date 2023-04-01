import { SCRIBBLE_TYPES } from '../../../constants'

// Step 1: Draw all polygons to canvas
const drawBrushToMask = (maskBitmap, scribbles, options) => {
  const { canvasWidth, canvasHeight } = options

  let tmpCanvas = document.createElement("canvas")
  tmpCanvas.setAttribute("id", "tmpCanvas")
  tmpCanvas.setAttribute("width", canvasWidth)
  tmpCanvas.setAttribute("height", canvasHeight)

  let ctx = tmpCanvas.getContext('2d')

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  if (maskBitmap) {
    ctx.drawImage(maskBitmap, 0, 0)
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  scribbles.forEach((scribble) => {
    const { points, type, strokeWidth } = scribble
    if (type === SCRIBBLE_TYPES.POSITIVE) {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
    } else {
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#000';
    }
    ctx.lineWidth = strokeWidth
    ctx.beginPath();
    ctx.moveTo(points[0][0] * canvasWidth, points[0][1] * canvasHeight);
    points.forEach(point => {
      ctx.lineTo(point[0] * canvasWidth, point[1] * canvasHeight)
    });
    ctx.stroke();
    // ctx.fill();
  })
  // let imgData = tmpCanvas.toDataURL();
  
  // return imgData
  return new Promise(function (resolve, reject) {
    tmpCanvas.toBlob(function (blob) {
      resolve(blob)
    })
  })
}

export default drawBrushToMask