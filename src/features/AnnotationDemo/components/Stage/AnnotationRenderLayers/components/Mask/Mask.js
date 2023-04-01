import React from 'react'

import KonvaImage from '../../../../../../../components/KonvaImage'

import hexColorToRGB from '../../../../../../../utils/hexColorToRGB';

const ThresholdAndColorFilter = function (imageData) {
  var data = imageData.data,
    nPixels = data.length,
    color = hexColorToRGB(this.fill()),
    threshold = (this.threshold() || 0.5) * 255,
    i;

  for (i = 0; i < nPixels; i += 4) {
    if (data[i] < threshold) {
      data[i + 3] = 0
    } else {
      data[i] = color.r; // r
      data[i + 1] = color.g; // g
      data[i + 2] = color.b; // b
      data[i + 3] = 255; // alpha
    }
  }
}

const Mask = (props) => {
  const { 
    isSelected, 
    maskBmp,
    handleSelectMask,
    handleContextMenu,
    color,
    opacity,
    threshold,
    imageWidth,
    imageHeight,
  } = props

  return (maskBmp && 
    <KonvaImage
      cache
      hitFromCache
      bitmap={maskBmp}
      opacity={isSelected ? opacity + 0.2 : opacity}
      width={imageWidth}
      height={imageHeight}
      onClick={handleSelectMask}
      onTap={handleSelectMask}
      onContextMenu={handleContextMenu}
      fill={color}
      threshold={threshold / 100}
      filters={[ThresholdAndColorFilter]}
      globalCompositeOperation={'lighten'}
    />
  )
}

export default Mask