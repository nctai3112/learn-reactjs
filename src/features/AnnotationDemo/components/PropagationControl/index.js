import React, { useCallback } from 'react'
import { find } from 'lodash'

import { useDatasetStore } from '../../stores/index'

import VideoPropagationControl from './components/VideoPropagationControl/index'

import VideoDataInstanceClass from '../../../../classes/VideoDataInstanceClass'

const PropagationControl = () => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))
  
  if (dataInstance instanceof VideoDataInstanceClass) {
    return <VideoPropagationControl/>
  }
  return null
}

export default PropagationControl