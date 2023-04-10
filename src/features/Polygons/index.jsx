import { useState, useEffect } from "react";
// import { Stage, Image, Layer } from "react-konva";
import { Stage, Layer, Line } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import * as _ from "lodash";
import { Polygon } from "./Polygon";

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
      setPolyComplete(true);
      setPolygons([...polygons, points]);
      setPoints([]);
      // setPolyComplete(false);
      setMouseOverPoint(false);
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

  const handleGroupDragEnd = (e) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      polygons.map((pointArr) => {
        if (pointArr.every((element) => points.includes(element))) {
          pointArr = result;
        }
        return pointArr;
      });
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };

  return (
    <>
      {/* <button
        onClick={(e) => {
          setPolygons([...polygons, points]);
          setPoints([]);
          setPolyComplete(false);
          setMouseOverPoint(false);
        }}
      >
        Update
      </button> */}
      <BaseImageComponent
        // handleMouseDownOnStage={handleMouseDownOnImage}
        handleMouseDownOnImage={handleMouseDownOnImage}
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
              stroke={"red"}
              height={height}
            />
          ))}
          <Polygon
            isFinished={isPolyComplete}
            flattenedPoints={flattenedPoints}
            points={points}
            width={width}
            height={height}
            stroke={"black"}
            handlePointDragMove={handlePointDragMove}
            handleGroupDragEnd={handleGroupDragEnd}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            handlePointMouseDown={handleMouseDownOnImage}
          />
        </Layer>
      </BaseImageComponent>
    </>
  );
};

export default PolygonsAnnotation;
