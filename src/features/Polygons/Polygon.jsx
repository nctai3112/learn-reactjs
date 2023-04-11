import { useState } from "react";
import { Group, Line, Circle } from "react-konva";
import { minMax, dragBoundFunc } from "../../utils";

export const Polygon = ({
  points,
  width,
  height,
  flattenedPoints,
  isFinished,
  stroke,
  handleGroupDragEnd = function () {},
  handlePointDragMove = function () {},
  handleMouseOverStartPoint = function () {},
  handleMouseOutStartPoint = function () {},
  handlePointMouseDown = function () {},
  handleLineMouseDown = function () {},
}) => {
  const [stage, setStage] = useState();
  const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
  const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis

  const _id = String(Math.random());
  const _name = `group-${_id}`;
  const vertexRadius = 6;

  const handleGroupMouseOver = (e) => {
    if (!isFinished) return;
    e.target.getStage().container().style.cursor = "move";
    setStage(e.target.getStage());
  };

  const handleGroupMouseOut = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };

  const handleGroupDragStart = (e) => {
    let arrX = points.map((p) => p[0]);
    let arrY = points.map((p) => p[1]);
    setMinMaxX(minMax(arrX));
    setMinMaxY(minMax(arrY));
  };

  const groupDragBound = (pos) => {
    let { x, y } = pos;
    const sw = stage.width();
    const sh = stage.height();
    if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
    if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
    if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
    if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
    return { x, y };
  };

  return (
    <>
      <Group
        id={_id}
        name={"polygon"}
        draggable={isFinished}
        onDragStart={handleGroupDragStart}
        onDragEnd={handleGroupDragEnd}
        dragBoundFunc={groupDragBound}
        onMouseOver={handleGroupMouseOver}
        onMouseOut={handleGroupMouseOut}
      >
        <Line
          points={flattenedPoints}
          stroke={stroke}
          strokeWidth={3}
          closed={isFinished}
          fill="rgb(140,30,255,0.5)"
          onMouseDown={handleLineMouseDown}
        />
        {points.map((point, index) => {
          const x = point[0] - vertexRadius / 2;
          const y = point[1] - vertexRadius / 2;
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint,
                  onMouseDown: handlePointMouseDown,
                }
              : null;

          return (
            <Circle
              x={x}
              y={y}
              key={index}
              radius={vertexRadius}
              fill="#FF019A"
              stroke="#00F1FF"
              strokeWidth={2}
              {...startPointAttr}
              onDragMove={handlePointDragMove}
              dragBoundFunc={(pos) =>
                dragBoundFunc(stage.width(), stage.height(), vertexRadius, pos)
              }
            />
          );
        })}
      </Group>
    </>
  );
};
