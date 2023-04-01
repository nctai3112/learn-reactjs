import React from 'react'
import create from 'zustand'

import { useGeneralStore } from '../../../stores'
import EventCenter from '../../../EventCenter'

import {
  EVENT_TYPES,
  MIN_ZOOM_SCALE, MAX_ZOOM_SCALE, } from '../../../constants';


const Cursor = (props) => {
  const stage = useGeneralStore(state => state.stage)

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  let lastDist = 0
  let lastCenter = null
  const handleTouchMove = (e) => {
    window.addEventListener("touchend", handleTouchEnd)

    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      stage.stopDrag();

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        lastCenter = getCenter(p1, p2)
        return;
      }
      const newCenter = getCenter(p1, p2);

      const dist = getDistance(p1, p2);

      if (!lastDist) {
        lastDist = dist;
      }

      // local coordinates of center point
      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleY(),
      };

      const scale = stage.scaleX() * (dist / lastDist);
      stage.scale({ x: scale, y: scale })

      // calculate new position of the stage
      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      stage.position(newPos);

      lastDist = dist
      lastCenter = newCenter
      stage.batchDraw();
    }
  }

  const handleTouchEnd = () => {
    lastDist = 0
    lastCenter = null

    window.removeEventListener("touchend", handleTouchEnd)
  }



  const handleZoom = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // limit zoom scale
    if (newScale >= MIN_ZOOM_SCALE && newScale <= MAX_ZOOM_SCALE) {
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    }
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_TOUCH_MOVE]: getSubject(EVENT_TYPES.STAGE_TOUCH_MOVE)
        .subscribe({ next: (e) => handleTouchMove(e) }),
      [EVENT_TYPES.STAGE_WHEEL]: getSubject(EVENT_TYPES.STAGE_WHEEL)
        .subscribe({ next: (e) => handleZoom(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [stage])

  return (
    null
  )
}

export default Cursor