import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";

const ImageWithRectangle = () => {
  const [image, setImage] = useState(null);
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src =
      "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const handleMouseDown = (e) => {
    console.log("🚀 ~ file: index.jsx:24 ~ handleMouseDown ~ e:", e);
    if (rect.width === 0 || rect.height === 0) {
      // if (!isEditing) {
      let { x, y } = e.target.getStage().getPointerPosition();
      console.log(x);
      console.log(y);
      setRect({ x: x, y: y, width: 1, height: 1 });
      // console.log("click1");
      // } else {
      // console.log("click2");
      // }
      setIsEditing(true);
      return;
    }
    if (!isEditing) {
      console.log(
        "🚀 ~ file: index.jsx:37 ~ handleMouseDown ~ isEditing:",
        isEditing
      );
      setIsEditing(true);
      return;
    }
    if (isEditing) {
      console.log(
        "🚀 ~ file: index.jsx:42 ~ handleMouseDown ~ isEditing:",
        isEditing
      );
      setIsEditing(false);
      return;
    }
  };

  const handleMouseMove = (e) => {
    if (rect.width === 0 || rect.height === 0) {
      return;
    }
    if (isEditing) {
      // console.log("🚀 ~ file: index.jsx:53 ~ handleMouseMove ~ EVENT:", e);
      const { x, y } = e.target.getStage().getPointerPosition();
      const newRect = {
        x: Math.min(rect.x, x),
        y: Math.min(rect.y, y),
        width: Math.abs(rect.x - x),
        height: Math.abs(rect.y - y),
      };
      setRect(newRect);
    }
  };

  return (
    <Stage width={800} height={600}>
      <Layer>
        <Image
          image={image}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
        />
        <Rect
          onMouseDown={handleMouseDown}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke="red"
        />
      </Layer>
    </Stage>
  );
};

export default ImageWithRectangle;
