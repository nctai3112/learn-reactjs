// ImageComponent.jsx

import React, { useRef, useEffect } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import "./styles.css";

const KonvaImage = () => {
  const imageRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const stage = stageRef.current;
    const layer = layerRef.current;

    const imageObj = new window.Image();
    imageObj.src =
      "https://images.freeimages.com/images/previews/ac9/railway-hdr-1361893.jpg";
    imageObj.onload = () => {
      image.image(imageObj);

      // scale the image to fit the frame
      const scale = Math.min(
        stage.width() / imageObj.width,
        stage.height() / imageObj.height
      );
      image.scale({ x: scale, y: scale });

      // center the image in the frame
      image.offsetX(image.width() / 2);
      image.offsetY(image.height() / 2);

      layer.batchDraw();
    };
  }, []);

  return (
    <div id="konva-container">
      <div id="konva-frame"></div>
      <Stage width={400} height={400} ref={stageRef}>
        <Layer ref={layerRef}>
          <Image ref={imageRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaImage;
