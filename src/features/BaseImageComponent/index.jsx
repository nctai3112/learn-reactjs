import { useLayoutEffect, useState, useMemo, useRef } from "react";
import { Stage, Image, Layer } from "react-konva";

const BaseImageComponent = ({
  imageUrl,
  width,
  height,
  children,
  handleMouseDownOnImage,
  handleMouseMoveOnImage,
}) => {
  const imageRef = useRef(null);
  const [image, setImage] = useState();
  const [size, setSize] = useState({});

  const imageElement = useMemo(() => {
    const element = new window.Image();
    element.width = width || 650;
    element.height = height || 302;
    element.src = imageUrl;
    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  // Run before update layout
  useLayoutEffect(() => {
    const onload = function () {
      setSize({
        width: imageElement.width,
        height: imageElement.height,
      });
      setImage(imageElement);
      imageRef.current = imageElement;
    };
    imageElement.addEventListener("load", onload);
    return () => {
      imageElement.removeEventListener("load", onload);
    };
  }, [imageElement]);

  const baseHandleMouseDown = (event) => {
    // If the event fire from image -> prevent it
    // Tai: currently raising the error with getStage here.
    // if (!event.target.getAttrs().image) return;
    // const stage = event.target.getStage();
    // const pos = getMousePos(stage);
    // handleMouseDownOnImage(pos);
  };

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  return (
    <>
      <Stage
        width={size.width}
        height={size.height}
        onMouseDown={baseHandleMouseDown}
      >
        <Layer>
          <Image
            onMouseDown={handleMouseDownOnImage}
            onMouseMove={handleMouseMoveOnImage}
            ref={imageRef}
            image={image}
            x={0}
            y={0}
            width={size.width}
            height={size.height}
          />
        </Layer>
        {children}
      </Stage>
    </>
  );
};

export default BaseImageComponent;
