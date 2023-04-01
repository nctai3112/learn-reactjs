import { get } from 'lodash'

const getStagePosLimit = (stage, stageSize, renderingSize) => {
  const stagePos = stage.position()

  const scale = stage.scaleX();
  const renderingWidth = get(renderingSize, 'width', 1)
  const renderingHeight = get(renderingSize, 'height', 1)

  // limit viewport movement base on scale
  // allow at most half of each dimension out of viewport
  let posLimit = {
    xMin: -stageSize.width / 2,
    xMax: stageSize.width / 2,
    yMin: -stageSize.height / 2,
    yMax: stageSize.height / 2,
  }
  if (renderingWidth && renderingHeight) {
    if (renderingWidth * scale <= stageSize.width) {
      let acceptedOutWidth = (renderingWidth * scale / 2)
      posLimit.xMin = Math.min(0 - acceptedOutWidth, stagePos.x)
      posLimit.xMax = Math.max(stageSize.width - (renderingWidth * scale) + acceptedOutWidth, stagePos.x)
    } else {
      let acceptedOutWidth = (stageSize.width / 2)
      posLimit.xMin = Math.min(stageSize.width - renderingWidth * scale - acceptedOutWidth, stagePos.x)
      posLimit.xMax = Math.max(0 + acceptedOutWidth, stagePos.x)
    }
    if (renderingHeight * scale <= stageSize.height) {
      let acceptedOutHeight = (renderingHeight * scale / 2)
      posLimit.yMin = Math.min(0 - acceptedOutHeight, stagePos.y)
      posLimit.yMax = Math.max(stageSize.height - (renderingHeight * scale) + acceptedOutHeight, stagePos.y)
    } else {
      let acceptedOutHeight = (stageSize.height / 2)
      posLimit.yMin = Math.min(stageSize.height - renderingHeight * scale - acceptedOutHeight, stagePos.y)
      posLimit.yMax = Math.max(0 + acceptedOutHeight, stagePos.y)
    }
  }

  return posLimit
}

export default getStagePosLimit