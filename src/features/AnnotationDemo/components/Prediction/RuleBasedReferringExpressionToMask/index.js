import React from 'react'

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'
import sendFormData from '../../../../../utils/sendFormData'


const RuleBasedReferringExpressionToMask = (props) => {
  /**
   * 
   * @param {object} data - annotation_id, expression
   * @returns 
   */
  const handleRunReferringExpressionToMask = async (data) => {
    const predictedMask = await sendFormData(
      '/refex/rule-based',
      data
    )
      .catch((err) => {
        console.log(err)
        return null
      })

    if (!predictedMask) {
      EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.RULE_BASED_REFERRING_EXPRESSION_TO_MASK_ERROR)()
      return;
    }

    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.RULE_BASED_REFERRING_EXPRESSION_TO_MASK_FINISH)(predictedMask)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.REFERRING_EXPRESSION.RULE_BASED_REFERRING_EXPRESSION_TO_MASK]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.RULE_BASED_REFERRING_EXPRESSION_TO_MASK)
        .subscribe({ next: (data) => handleRunReferringExpressionToMask(data) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])
  return (
    null
  )
}

export default RuleBasedReferringExpressionToMask