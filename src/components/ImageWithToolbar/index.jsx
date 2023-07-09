import React, { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";

function KonvaToolbar() {
  const [imageProps, setImageProps] = useState({
    image: new window.Image(),
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
  });

  useEffect(() => {
    loadImage("https://cdn.tgdd.vn/Files/2015/07/09/665092/topgameminion.png");
  }, []);

  const loadImage = (url) => {
    const image = new window.Image();
    image.src = url;
    image.onload = () => {
      setImageProps({
        ...imageProps,
        image: image,
        width: image.width,
        height: image.height,
      });
    };
  };

  const handleZoom = (factor) => {
    const newScale = imageProps.scale * factor;
    setImageProps({ ...imageProps, scale: newScale });
  };

  const handleFlip = (axis) => {
    const newValue = !imageProps[axis];
    setImageProps({ ...imageProps, [axis]: newValue });
  };

  const handleRotate = (direction) => {
    const newRotation = imageProps.rotation + direction * 90;
    setImageProps({ ...imageProps, rotation: newRotation });
  };

  return (
    <div>
      <button onClick={() => handleZoom(1.1)}>Zoom In</button>
      <button onClick={() => handleZoom(0.9)}>Zoom Out</button>
      <button onClick={() => handleFlip("flipX")}>Flip Horizontally</button>
      <button onClick={() => handleFlip("flipY")}>Flip Vertically</button>
      <button onClick={() => handleRotate(-1)}>Rotate Left</button>
      <button onClick={() => handleRotate(1)}>Rotate Right</button>
      <Stage x={0} y={0} width={imageProps.width} height={imageProps.height}>
        <Layer>
          <Image
            image={imageProps.image}
            x={imageProps.width / 2}
            y={imageProps.height / 2}
            // width={imageProps.width * imageProps.scale}
            // height={imageProps.height * imageProps.scale}
            width={imageProps.width}
            height={imageProps.height}
            rotation={imageProps.rotation}
            scaleX={imageProps.flipX ? -1 : 1}
            scaleY={imageProps.flipY ? -1 : 1}
            offsetX={imageProps.width / 2}
            offsetY={imageProps.height / 2}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default KonvaToolbar;
