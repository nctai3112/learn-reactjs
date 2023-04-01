const pointArrayToFlattenPointArray = (arr, scaleX = 1, scaleY = 1) => {
  return arr.reduce((a, b) => a.concat([b[0] * scaleX, b[1] * scaleY]), [])
}

export default pointArrayToFlattenPointArray