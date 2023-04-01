import React, { useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { find } from 'lodash'

import ButtonControlGroup from './ButtonControlGroup'
import VideoTrack from './VideoTrack'
import TrackInfo from './TrackInfo'

import { useDatasetStore } from '../../../../stores/index'
import EventCenter from '../../../../EventCenter'

import { EVENT_TYPES } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5px 10px',
    width: '100%',
    background: theme.palette.primary.dark
  },
}))


const VideoPlayControl = (props) => {
  const classes = useStyles()

  const videoId = useDatasetStore(state => state.instanceId)
  const video = useDatasetStore(useCallback(state => find(state.dataInstances, { id: videoId }), [videoId]))
  const getVideoId = useDatasetStore(state => state.getInstanceId)
  const playingState = useDatasetStore(state => state.playingState)
  const getPlayingState = useDatasetStore(state => state.getPlayingState)
  const setPlayingState = useDatasetStore(state => state.setPlayingState)
  const increaseBufferingFrame = useDatasetStore(state => state.increaseBufferingFrame)
  const increaseLazyBufferingFrame = useDatasetStore(state => state.increaseLazyBufferingFrame)
  const increasePlayingFrame = useDatasetStore(state => state.increasePlayingFrame)
  const setCurrentAnnotationImageId = useDatasetStore(state => state.setCurrentAnnotationImageId)
  // const setCurrentAnnotationImage = useDatasetStore(state => state.setCurrentAnnotationImage)

  const isPlaying = useDatasetStore(state => state.isPlaying)
  const getIsPlaying = useDatasetStore(state => state.getIsPlaying)
  const setIsPlaying = useDatasetStore(state => state.setIsPlaying)

  const { fps, numFrames } = video

  useEffect(() => {
    EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE)()
  }, [])
  useEffect(() => {
    setIsPlaying(false)
    setPlayingState({
      playingFrame: 0,
      bufferingFrame: -1,
      lazyBufferingFrame: -1,
      slowDownRate: 1
    })
    handleBufferingVideo(videoId)
  }, [videoId])

  useEffect(() => {
    if (video && playingState) {
      const currentFrame = video.getCurrentImage(playingState)
      setCurrentAnnotationImageId(currentFrame?.id)
    }
  }, [videoId, playingState])


  const handleBufferingVideo = async (playingId) => {
    const videoId = getVideoId()
    const playingState = getPlayingState()
    let { bufferingFrame, lazyBufferingFrame } = playingState

    if (playingId !== videoId || (bufferingFrame + 1 >= numFrames && lazyBufferingFrame + 1 >= numFrames)) {
      return
    }
    if (bufferingFrame + 1 < numFrames) {
      await video.frames[bufferingFrame + 1]?.original?.getBitmap()
      increaseBufferingFrame(1)
    } else {
      if (lazyBufferingFrame + 1 < numFrames) {
        await video.frames[lazyBufferingFrame + 1]?.original?.getBitmap()
        increaseLazyBufferingFrame(1)
      }
    }
    if (playingId === videoId) {
      setTimeout(() => handleBufferingVideo(playingId), 0)
    }
  }

  const handleGoToFrame = async (frame, jump) => {
    if (jump) {
      setPlayingState({ bufferingFrame: frame })
    }
    await video.frames[frame]?.original?.getBitmap()
    if (jump) {
      setPlayingState({ playingFrame: frame })
    } else {
      increasePlayingFrame(1)
    }
  }

  const handlePlayVideo = async (playingId) => {
    const playingState = getPlayingState()
    const { playingFrame, slowDownRate = 1 } = playingState

    if (playingFrame + 1 < numFrames) {
      await handleGoToFrame(playingFrame + 1)

      const isPlaying = getIsPlaying()
      const videoId = getVideoId()
      if (isPlaying && playingId === videoId) {
        setTimeout(() => {
          handlePlayVideo(playingId)
        }, 1000 / (fps * slowDownRate));
      }
    } else {
      setIsPlaying(false)
    }
  }

  const handleSkipFrame = (step) => async () => {
    const { playingFrame } = playingState

    const newPlayingFrame = Math.min(Math.max(playingFrame + step, 0), numFrames - 1)
    await handleGoToFrame(newPlayingFrame, true)
  }


  const handleClickPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      handlePlayVideo(videoId)
    }
  }

  const handleClickPause = () => {
    setIsPlaying(false)
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.PLAY_CONTROL.GO_TO_FRAME]: getSubject(EVENT_TYPES.PLAY_CONTROL.GO_TO_FRAME)
        .subscribe({ next: (frame) => handleGoToFrame(frame, true) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <Grid container className={classes.root} direction="row">
      <ButtonControlGroup
        isPlaying={isPlaying}
        handleSkipFrame={handleSkipFrame}
        handleClickPlay={handleClickPlay}
        handleClickPause={handleClickPause}
        slowDownRate={playingState.slowDownRate}
        setPlayingState={setPlayingState}
      />
      <VideoTrack
        numFrames={video.numFrames}
        playingFrame={playingState.playingFrame}
        handleGoToFrame={handleGoToFrame}
      />
      <TrackInfo
        fps={video.fps}
        numFrames={video.numFrames}
        playingFrame={playingState.playingFrame}
        handleGoToFrame={handleGoToFrame}
      />
    </Grid>
  )
}

export default VideoPlayControl