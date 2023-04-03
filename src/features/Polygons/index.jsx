import { useState, useEffect } from "react";
// import { Stage, Image, Layer } from "react-konva";
import { Group, Layer, Line, Circle } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import { minMax, dragBoundFunc } from "../../utils";
import * as _ from "lodash";

const Polygon = ({
  points,
  width,
  height,
  flattenedPoints,
  isFinished,
  handleGroupDragEnd = function () {},
  handlePointDragMove = function () {},
  handleMouseOverStartPoint = function () {},
  handleMouseOutStartPoint = function () {},
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
        name={_name}
        draggable={isFinished}
        onDragStart={handleGroupDragStart}
        onDragEnd={handleGroupDragEnd}
        dragBoundFunc={groupDragBound}
        onMouseOver={handleGroupMouseOver}
        onMouseOut={handleGroupMouseOut}
      >
        <Line
          points={flattenedPoints}
          stroke="#00F1FF"
          strokeWidth={3}
          closed={isFinished}
          fill="rgb(140,30,255,0.5)"
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

const PolygonsAnnotation = ({ imageUrl }) => {
  const width = 500;
  const height = 500;

  const [polygons, setPolygons] = useState([]);
  const [position, setPosition] = useState(null);
  const [flattenedPoints, setFlattenedPoints] = useState([]);
  const [points, setPoints] = useState([]);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);

  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };

  useEffect(() => {
    const _flatten = _.flatten(points.concat(isPolyComplete ? [] : position));
    setFlattenedPoints(_flatten);
  }, [points, isPolyComplete, position]);

  const handleMouseDownOnImage = (pos) => {
    if (isPolyComplete) return;
    if (points.length >= 3 && isMouseOverPoint) {
      console.log("completed", pos, points[0]);
      setPolyComplete(true);
      return;
    }

    setPoints([...points, pos]);
  };

  const handleMouseMoveOnImage = (pos) => {
    if (!isPolyComplete) setPosition(pos);
  };

  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  return (
    <>
      <button
        onClick={(e) => {
          setPolygons([...polygons, points]);
          setPoints([]);
          setPolyComplete(false);
          setMouseOverPoint(false);
        }}
      >
        Update
      </button>
      <BaseImageComponent
        handleMouseDownOnStage={handleMouseDownOnImage}
        handleMouseMoveOnImage={handleMouseMoveOnImage}
        imageUrl={imageUrl}
        width={width}
        height={height}
      >
        <Layer>
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              isFinished={true}
              flattenedPoints={_.flatten([...polygon])}
              points={polygon}
              width={width}
              height={height}
            />
          ))}
          <Polygon
            isFinished={isPolyComplete}
            flattenedPoints={flattenedPoints}
            points={points}
            width={width}
            height={height}
            handlePointDragMove={handlePointDragMove}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
          />
        </Layer>
      </BaseImageComponent>
    </>
  );
};

export default PolygonsAnnotation;
