import React, { useRef, useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'

import EventCenter from '../../../../../EventCenter'
import { useGeneralStore } from '../../../../../stores';

import { EVENT_TYPES } from '../../../../../constants'

import FrameItem from './FrameItem'
import EmptyItem from './EmptyItem'

const SLIDE_WIDTH = 50

const useStyles = makeStyles(theme => ({
  sliderRoot: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frameItemRoot: {
    height: 50,
    boxSizing: 'border-box',
    width: SLIDE_WIDTH,
    paddingLeft: 5,
    paddingRight: 5,
  }
}))


const FrameCarousel = (props) => {
  const classes = useStyles()

  const stageSize = useGeneralStore(state => state.stageSize)
  const visibleSlides = useMemo(() => {
    let slots = Math.round((stageSize.width - SLIDE_WIDTH) / SLIDE_WIDTH)
    if (slots % 2 === 0) slots -= 1
    return slots
  }, [stageSize])

  const { playingFrame, annotations } = props

  const handleGoToFrame = (index) => {
    EventCenter.emitEvent(EVENT_TYPES.PLAY_CONTROL.GO_TO_FRAME)(index)
  }


  const renderingAnnotations = useMemo(() => {
    const totalFrame = annotations.length
    let eachSideCount = Math.floor(visibleSlides / 2)
    let result = []
    for (let i = playingFrame - eachSideCount; i <= playingFrame + eachSideCount; ++i) {
      if (i < 0 || i >= totalFrame) {
        result.push(
          <EmptyItem 
            key={i}
            className={classes.frameItemRoot}
          />
        )
      } else {
        result.push(
          <FrameItem
            key={i}
            index={i}
            isActive={playingFrame === i}
            annotation={annotations[i]}
            onFocus={() => handleGoToFrame(i)}
            onClick={() => handleGoToFrame(i)}
            className={classes.frameItemRoot}
          />
        )
      }
    }
    return result
  }, [annotations, playingFrame, visibleSlides])

  return (
    <div
      className={classes.sliderRoot}
    >
      {renderingAnnotations}
    </div>
  );
}

export default FrameCarousel