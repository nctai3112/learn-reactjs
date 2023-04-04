import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import BaseImageComponent from "../../features/BaseImageComponent";

const ImageWithRectangle = () => {
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

  // Load the image for annotating.
  const imageUrl =
    "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";
  // useEffect(() => {
  //   const img = new window.Image();
  //   img.src =
  //     "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";
  //   img.onload = () => {
  //     setImage(img);
  //   };
  // }, []);

  // Handle event click on image
  // --> (get position x, y for the first time create bounding box)
  const handleMouseDownOnImage = (e) => {
    // if starting drawing (first click) --> get first location to create rect position.
    if (!isEditing) {
      let { x, y } = e.target.getStage().getPointerPosition();
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
      setIsEditing(false);
    }
  };

  const handleMouseMoveOnImage = (e) => {
    if (!isEditing) {
      return;
    }
    if (isEditing) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setRect({
        id: String(boundingBoxes.length + 1),
        x: Math.min(rect.x, x),
        y: Math.min(rect.y, y),
        width: Math.abs(rect.x - x),
        height: Math.abs(rect.y - y),
      });
    }
  };

  const renderBoundingBoxes = () => {
    if (boundingBoxes.length > 0) {
      return boundingBoxes.map(({ id, x, y, width, height }) => {
        console.log("in rectangle rendering");
        console.log({ id, x, y, width, height });
        if (x !== 0 && y !== 0) {
          return (
            <Rect
              onMouseDown={handleMouseDownOnRect}
              key={String(id)}
              id={String(id)}
              x={x}
              y={y}
              width={width}
              height={height}
              stroke="black"
              strokeWidth={3}
            />
          );
        }
        return <></>;
      });
    }
    return <></>;
  };

  return (
    // <Stage width={800} height={600}>
    //   <Layer>
    //     <Image
    //       image={image}
    //       onMouseDown={handleMouseDownOnImage}
    //       onMouseMove={handleMouseMoveOnImage}
    //     />
    //     <Rect
    //       x={rect.x}
    //       y={rect.y}
    //       width={rect.width}
    //       height={rect.height}
    //       stroke="red"
    //       onMouseDown={handleMouseDownOnRect}
    //     />
    //     {renderBoundingBoxes()}
    //   </Layer>
    // </Stage>

    <BaseImageComponent
      imageUrl={imageUrl}
      width={800}
      height={600}
      handleMouseDownOnImage={handleMouseDownOnImage}
      handleMouseMoveOnImage={handleMouseMoveOnImage}
    >
      <Layer>
        <Rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke="red"
          onMouseDown={handleMouseDownOnRect}
        />
        {renderBoundingBoxes()}
      </Layer>
    </BaseImageComponent>
  );
};

export default ImageWithRectangle;
