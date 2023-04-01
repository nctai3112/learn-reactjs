import React, { useCallback } from 'react'
import { find } from 'lodash'

import { useDatasetStore } from '../../stores/index'

import ImagePlayControl from './components/ImagePlayControl/ImagePlayControl'
import VideoPlayControl from './components/VideoPlayControl/VideoPlayControl'

import VideoDataInstanceClass from '../../../../classes/VideoDataInstanceClass'
import ImageDataInstanceClass from '../../../../classes/ImageDataInstanceClass'

const PlayControl = (props) => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))
  
  if (dataInstance instanceof ImageDataInstanceClass) {
    return <ImagePlayControl/>
  }
  if (dataInstance instanceof VideoDataInstanceClass) {
    return <VideoPlayControl/>
  }
  return null
}

export default PlayControl