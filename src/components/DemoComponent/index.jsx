import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
// import BaseImageComponent from "../../features/BaseImageComponent";

const ImageWithRectangle = () => {
  const [image, setImage] = useState(null);
  // Create the default image.
  const [rect, setRect] = useState({
    id: "0",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  // Check the current bouding box is editing or not.
  const [isEditing, setIsEditing] = useState(false);
  // Check the current bouding box is finished or not.
  const [isFinished, setIsFinished] = useState(false);
  // Array to store all bouding boxes.
  const [boudingBoxes, setBoudingBoxes] = useState([]);

  // Load the image for annotating.
  // const imageUrl =
  //   "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";
  useEffect(() => {
    const img = new window.Image();
    img.src =
      "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const drawingBoudingBoxes = () => {};

  // Handle event click on image
  // --> (get position x, y for the first time create bouding box)
  const handleMouseDownOnImage = (e) => {
    console.log(
      "🚀 ~ file: index.jsx:39 ~ handleMouseDownOnImage ~ isFinished:",
      isFinished
    );
    if (!isFinished) {
      console.log("click first time!");
      let { x, y } = e.target.getStage().getPointerPosition();
      setRect({
        id: String(boudingBoxes.length + 1),
        x: x,
        y: y,
        width: 1,
        height: 1,
      });
      setBoudingBoxes([...boudingBoxes, rect]);
      console.log(
        "🚀 ~ file: index.jsx:55 ~ handleMouseDownOnImage ~ boudingBoxes:",
        boudingBoxes
      );
      setIsEditing(true);
      return;
    }
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (isEditing) {
      setIsEditing(false);
      return;
    }
  };

  const handleMouseDownOnRect = (e) => {
    if (isEditing) {
      setBoudingBoxes([...boudingBoxes, rect]);
      console.log(
        "🚀 ~ file: index.jsx:66 ~ handleMouseDownOnRect ~ boudingBoxes:",
        boudingBoxes
      );
      setIsEditing(false);
      setIsFinished(true);
    }
  };

  const handleMouseMoveOnImage = (e) => {
    // if (rect.width === 0 || rect.height === 0) {
    //   return;
    // }
    if (isFinished) {
      return;
    }
    if (isEditing) {
      // console.log("🚀 ~ file: index.jsx:53 ~ handleMouseMove ~ EVENT:", e);
      const { x, y } = e.target.getStage().getPointerPosition();
      setRect({
        id: String(boudingBoxes.length + 1),
        x: Math.min(rect.x, x),
        y: Math.min(rect.y, y),
        width: Math.abs(rect.x - x),
        height: Math.abs(rect.y - y),
      });
    }
  };

  const renderBoudingBoxes = () => {
    if (boudingBoxes.length > 0) {
      return boudingBoxes.map(({ id, x, y, width, height }) => {
        console.log("in rectangle rendering");
        console.log({ id, x, y, width, height });
        if (x !== 0 && y !== 0) {
          return (
            <Rect
              // onMouseDown={handleMouseDownOnRect}
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
    <Stage width={800} height={600}>
      <Layer>
        <Image
          image={image}
          onMouseDown={handleMouseDownOnImage}
          onMouseMove={handleMouseMoveOnImage}
        />
        {/* {drawingBoudingBoxes()} */}
        {renderBoudingBoxes()}
      </Layer>
    </Stage>

    // <BaseImageComponent
    //   imageUrl={imageUrl}
    //   width={800}
    //   height={600}
    //   handleMouseDownOnImage={handleMouseDownOnImage}
    //   handleMouseMoveOnImage={handleMouseMoveOnImage}
    // >
    //   <Layer>
    //     <Rect
    //       onMouseDown={handleMouseDownOnImage}
    //       x={rect.x}
    //       y={rect.y}
    //       width={rect.width}
    //       height={rect.height}
    //       stroke="red"
    //     />
    //   </Layer>
    // </BaseImageComponent>
  );
};

export default ImageWithRectangle;
