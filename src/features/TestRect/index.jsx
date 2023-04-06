import { useState, useEffect } from "react";
// import { Stage, Image, Layer } from "react-konva";
import { Layer } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import { Rectangle } from "../Rectangle";

const TestRect = ({ imageUrl }) => {
  const [initialRectangles, setInitialRectangles] = useState([]);
  const [selectedId, setSelectId] = useState();

  const handleMouseDownOnImage = (pos) => {
    setInitialRectangles([
      ...initialRectangles,
      {
        x: pos[0],
        y: pos[1],
        width: 1,
        height: 1,
        fill: "red",
        id: String(Math.random()),
      },
    ]);
  };

  useEffect(() => {
    setSelectId(initialRectangles[initialRectangles.length - 1]?.id);
  }, [initialRectangles]);

  return (
    <>
      <BaseImageComponent
        imageUrl={imageUrl}
        width={500}
        height={500}
        handleMouseDownOnImage={handleMouseDownOnImage}
      >
        <Layer>
          {initialRectangles.map((rect, index) => (
            <Rectangle
              key={index}
              shapeProps={rect}
              isSelected={selectedId === rect.id}
              onSelect={() => {
                setSelectId(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = initialRectangles.slice();
                rects[index] = newAttrs;
                setInitialRectangles(rects);
              }}
            />
          ))}
        </Layer>
      </BaseImageComponent>
      ;
    </>
  );
};

export default TestRect;
