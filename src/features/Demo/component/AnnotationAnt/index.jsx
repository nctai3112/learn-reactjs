import React, { useState } from "react";
import { Stage, Layer, Circle, Image } from "react-konva";

function DragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    // Check if the image was dropped inside the circle
    if (e.target.attrs.x > 200 && e.target.attrs.y > 200) {
      setPosition({ x: 250, y: 250 });
    } else {
      setPosition({ x: 50, y: 50 });
    }
  };

  const image = new window.Image();
  image.src =
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";

  return (
    <div>
      <Stage width={500} height={500}>
        <Layer>
          <Circle x={250} y={250} radius={50} stroke="black" />
          <Image
            draggable
            x={position.x}
            y={position.y}
            image={image}
            width={50}
            height={50}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            opacity={isDragging ? 0.5 : 1}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default DragAndDrop;
