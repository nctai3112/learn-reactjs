import React, { useState } from "react";
import { Layer, Rect, Group } from "react-konva";
import BaseImageComponent from "../../features/BaseImageComponent";

const ImageWithRectangle = () => {
  // const [image, setImage] = useState(null);
  // Create the default image.
  const [rect, setRect] = useState({
    id: "0",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  // Check the current bounding box is editing or not.
  const [isEditing, setIsEditing] = useState(false);
  // Array to store all bounding boxes.
  const [boundingBoxes, setBoundingBoxes] = useState([]);

  // Width, height for handling dragBoundFunc.
  const [currentDraggingWidth, setCurrentDraggingWidth] = useState(0);
  const [currentDraggingHeight, setCurrentDraggingHeight] = useState(0);

  const _id = String(Math.random());
  const _name = `group-${_id}`;

  const imageUrl =
    "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";

  const stageWidth = 800;
  const stageHeight = 600;

  // Handle event click on image
  // --> (get position x, y for the first time create bounding box)
  const handleMouseDownOnImage = (pos) => {
    // if starting drawing (first click) --> get first location to create rect position.
    if (!isEditing) {
      // let { x, y } = e.target.getStage().getPointerPosition();
      let [x, y] = pos;
      setRect({
        id: String(boundingBoxes.length + 1),
        x: x,
        y: y,
        width: 1,
        height: 1,
      });
      setIsEditing(true);
      return;
    }
    if (isEditing) {
      setIsEditing(false);
      return;
    }
  };

  const handleMouseDownOnRect = (e) => {
    // Mouse down on rect == end drawing a rect.
    if (isEditing) {
      setBoundingBoxes([...boundingBoxes, rect]);
      setRect({
        id: "0",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      setIsEditing(false);
    }
  };

  const handleMouseMoveOnImage = (pos) => {
    if (!isEditing) {
      return;
    }
    if (isEditing) {
      const [x, y] = pos;
      setRect({
        id: String(boundingBoxes.length + 1),
        x: Math.min(rect.x, x),
        y: Math.min(rect.y, y),
        width: Math.abs(rect.x - x),
        height: Math.abs(rect.y - y),
      });
    }
  };

  const handleGroupMouseOver = (e) => {
    if (isEditing) return;
    e.target.getStage().container().style.cursor = "move";
  };

  const handleGroupMouseOut = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };

  const handleRectDragEnd = (e) => {
    const newBoundingBox = boundingBoxes.map((boundingBox) => {
      if (boundingBox.id == e.target.id()) {
        boundingBox.x = e.target.x();
        boundingBox.y = e.target.y();
        boundingBox.width = e.target.width();
        boundingBox.height = e.target.height();
      }
      return boundingBox;
    });
    setBoundingBoxes(newBoundingBox);
  };

  // Not use yet.
  const handleGroupDragMove = (e) => {};
  const handleRectDragStart = (e) => {
    setCurrentDraggingHeight(e.target.height());
    setCurrentDraggingWidth(e.target.width());
  };
  const rectDragBound = (pos) => {
    let { x, y } = pos;

    if (x < 0) x = 0.1;
    if (y < 0) y = 0.1;
    if (x + currentDraggingWidth > stageWidth)
      x = stageWidth - currentDraggingWidth + 0.1;
    if (y + currentDraggingHeight > stageHeight)
      y = stageHeight - currentDraggingHeight + 0.1;
    return { x, y };
  };

  const renderBoundingBoxes = () => {
    if (!boundingBoxes.length) return <></>;
    return boundingBoxes
      .filter((prop) => prop.x !== 0 && prop.y !== 0)
      .map(({ id, x, y, width, height }) => {
        return (
          <Group
            id={"group_" + _id}
            name={"bounding_box"}
            draggable={false}
            onMouseOver={handleGroupMouseOver}
            onMouseOut={handleGroupMouseOut}
          >
            <Rect
              onMouseDown={handleMouseDownOnRect}
              onDragMove={handleGroupDragMove}
              onDragStart={handleRectDragStart}
              onDragEnd={handleRectDragEnd}
              dragBoundFunc={rectDragBound}
              key={"rect_" + String(id)}
              id={String(id)}
              x={x}
              y={y}
              draggable={true}
              width={width}
              height={height}
              stroke="#00F1FF"
              strokeWidth={3}
              fill="rgb(140,30,255,0.5)"
            />
          </Group>
        );
      });
  };

  return (
    <BaseImageComponent
      imageUrl={imageUrl}
      width={stageWidth}
      height={stageHeight}
      handleMouseDownOnImage={handleMouseDownOnImage}
      handleMouseMoveOnImage={handleMouseMoveOnImage}
    >
      <Layer>
        <Rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke="black"
          strokeWidth={3}
          onMouseDown={handleMouseDownOnRect}
        />
        {renderBoundingBoxes()}
      </Layer>
    </BaseImageComponent>
  );
};

export default ImageWithRectangle;
