import React from 'react'
import { get } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'

import KonvaImage from '../../../../../../components/KonvaImage'

const Video = (props) => {
  const { instanceId, video, renderingSize } = props
  
  const playingState = useDatasetStore(state => state.playingState)

  const playingFrame = get(playingState, 'playingFrame', 0)
  let bitmap = get(video, `frames[${playingFrame}].original.bitmap`, null)

  return ((video && video.id === instanceId) ?
    <KonvaImage
      bitmap={bitmap}
      width={renderingSize.width}
      height={renderingSize.height}
    />
    : null
  )
}

export default Video