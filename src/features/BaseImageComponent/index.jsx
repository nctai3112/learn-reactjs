import { useLayoutEffect, useState, useMemo, useRef, useEffect } from "react";
import { Stage, Image, Layer, Rect } from "react-konva";
import { Button } from "antd";
import "./styles.css"

const BaseImageComponent = ({
  imageUrl,
  width,
  height,
  children,
  sendScaleRateToParent = function() {},
  handleMouseDownOnStage = function () {},
  handleMouseDownOnImage = function () {},
  handleMouseMoveOnImage = function () {},
}) => {
  const stageContainer = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Width to render an image!
  const [imageMaxWidth, setImageMaxWidth] = useState(0);

  useEffect(() => {
    // GET CONTAINER INFORMATION. (DIV CONTAINING THE STAGE)
    const getContainerWidth = () => {
      if (stageContainer.current) {
        setContainerWidth(stageContainer.current.clientWidth);
      }
    };
    getContainerWidth(); // Initial width calculation
    window.addEventListener("resize", getContainerWidth);

    return () => {
      window.removeEventListener("resize", getContainerWidth);
    };
  }, []);

  useEffect(() => {
    if (containerWidth !== 0) {
      setImageMaxWidth(Math.round((containerWidth * 4) / 5));
    }
  }, [containerWidth]);

  // Image props for image customization.
  const [imageProps, setImageProps] = useState({
    image: new window.Image(),
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
  });
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

  const imageRef = useRef(null);
  const [image, setImage] = useState();
  const [scaleRate, setScaleRate] = useState(1);

  useEffect(() => {
    if (imageMaxWidth && width) {
      // Check if the current image width exceeds the max width or not.
      if (width > imageMaxWidth) {
        setScaleRate(imageMaxWidth / width);
        sendScaleRateToParent(scaleRate);
      }
    }
  }, [imageMaxWidth, width, scaleRate]);

  const imageElement = useMemo(() => {
    const element = new window.Image();
    element.width = width || 512;
    element.height = height || 512;
    element.src = imageUrl;

    setImageProps({
      ...imageProps,
      image: element,
      width: element.width,
      height: element.height,
    });
    return element;
  }, [imageUrl]);

  // Run before update layout
  useLayoutEffect(() => {
    const onload = function () {
      // setSize({
      //   width: imageElement.width,
      //   height: imageElement.height,
      // });
      setImage(imageElement);
      imageRef.current = imageElement;
    };
    imageElement.addEventListener("load", onload);
    return () => {
      imageElement.removeEventListener("load", onload);
    };
  }, [imageElement]);

  const baseHandleMouseDown = (event) => {
    const stage = event.target.getStage();
    const pos = getMousePos(stage);
    handleMouseDownOnStage(pos);
  };

  const baseHandleMouseMove = (event) => {
    // handleMouseMoveOnImage();
  };

  const baseHandleMouseMoveOnImage = (event) => {
    const stage = event.target.getStage();
    const pos = getMousePos(stage);
    handleMouseMoveOnImage(pos);
  };

  const baseHandleMouseDownOnImage = (event) => {
    const stage = event.target.getStage();
    const pos = getMousePos(stage);
    handleMouseDownOnImage(pos);
  };

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  return (
    <div className="outer-wrapper-konva">
      <div className="stage-wrapper" ref={stageContainer}>
        <Stage
          className="konva-stage"
          width={width * scaleRate}
          height={height * scaleRate}
          onMouseDown={baseHandleMouseDown}
          onMouseMove={baseHandleMouseMove}
        >
          <Layer>
            <Image
              onMouseDown={baseHandleMouseDownOnImage}
              onMouseMove={baseHandleMouseMoveOnImage}
              ref={imageRef}
              image={image}
              scaleX={
                scaleRate *
                `${imageProps.flipX ? -1 : 1}` *
                `${imageProps.scale}`
              }
              scaleY={
                scaleRate *
                `${imageProps.flipY ? -1 : 1}` *
                `${imageProps.scale}`
              }
              width={imageProps.width}
              height={imageProps.height}
              rotation={imageProps.rotation}
              x={(imageProps.width * scaleRate) / 2}
              y={(imageProps.height * scaleRate) / 2}
              offsetX={(imageProps.width * scaleRate) / 2}
              offsetY={(imageProps.height * scaleRate) / 2}
            />
          </Layer>
          {children}
        </Stage>
      </div>
      <div className="buttons-wrapper">
        <Button onClick={() => handleZoom(1.1)}>
          <img src="/icons/zoom_in.svg" width="10px" height="10px" />
        </Button>
        <Button onClick={() => handleZoom(0.9)}>
          <img src="/icons/zoom_out.svg" width="10px" height="10px" />
        </Button>
        <Button onClick={() => handleFlip("flipX")}>
          <img src="/icons/flip_vertical.svg" width="10px" height="10px" />
        </Button>
        <Button onClick={() => handleFlip("flipY")}>
          <img src="/icons/flip_horizontal.svg" width="10px" height="10px" />
        </Button>
        <Button onClick={() => handleRotate(-1)}>
          <img
            src="/icons/rotate_counterclockwise.svg"
            width="10px"
            height="10px"
          />
        </Button>
        <Button onClick={() => handleRotate(1)}>
          <img src="/icons/rotate_clockwise.svg" width="10px" height="10px" />
        </Button>
      </div>
    </div>
  );
};

export default BaseImageComponent;
