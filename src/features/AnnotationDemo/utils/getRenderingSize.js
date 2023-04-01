import { get } from 'lodash'

const getRenderingSize = (stageSize, instanceSize, padding) => {
  const maxWidth = stageSize.width - padding
  const maxHeight = stageSize.height - padding
  let instanceWidth = get(instanceSize, 'width', 1)
  let instanceHeight = get(instanceSize, 'height', 1)

  if ((instanceWidth / instanceHeight) > (maxWidth / maxHeight)) {
    return {
      height: instanceHeight * (maxWidth / instanceWidth),
      width: maxWidth
    }
  } else {
    return {
      height: maxHeight,
      width: instanceWidth * (maxHeight / instanceHeight)
    }
  }
}

export default getRenderingSize