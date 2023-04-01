const polysToSvgPathData = (polys, scaleWidth = 1, scaleHeight = 1) => {
  const pathData = polys.map(poly => poly.reduce((path, point, index, arr) => {
    path += (index ? "L" : "M") + String(point[0] * scaleWidth) + "," + String(point[1] * scaleHeight) + " "
    if (index + 1 === arr.length) {
      path += "z "
    }
    return path
  }, '')).join(' ')

  return pathData
}

export default polysToSvgPathData
