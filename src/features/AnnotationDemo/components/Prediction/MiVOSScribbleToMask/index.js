import React from 'react'

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'
import sendFormData from '../../../../../utils/sendFormData'


const MiVOSScribbleToMask = (props) => {
  /**
   * 
   * @param {object} data - image, p_srb, n_srb, mask (optional)
   * @returns 
   */
  const handleScribbleToMask = async (data) => {
    const predictedMask = await sendFormData(
      '/s2m/predict',
      data
    )
      .catch((err) => {
        console.log(err)
        return null
      })

    if (!predictedMask) {
      EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_ERROR)()
      return;
    }

    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_FINISH)(predictedMask)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.DRAW_MASK.MI_VOS_S2M]: getSubject(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M)
        .subscribe({ next: (data) => handleScribbleToMask(data) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])
  return (
    null
  )
}

export default MiVOSScribbleToMask