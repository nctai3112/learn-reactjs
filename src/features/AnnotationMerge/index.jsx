import React from "react";
// import PropTypes from "prop-types";
import { useState, useEffect } from "react";
// import { Stage, Image, Layer } from "react-konva";
import { Layer, Group, Rect } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import * as _ from "lodash";
import { Polygon } from "../Polygons/Polygon";
import PopupForm from "../../components/PopupForm";

// AnnotationMerge.propTypes = {};

function AnnotationMerge(props) {
  // EXPORT DATA.
  const [annotationData, setAnnotationData] = useState([]);
  function handleDownloadClick() {
    if (annotationData) {
      const jsonBlob = new Blob([JSON.stringify(annotationData, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(jsonBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "layer.json";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    }
  }

  // GLOBAL.
  const [modeController, setModeController] = useState("bounding-box");
  const width = 800;
  const height = 600;

  const handleMouseDownOnImage = (pos) => {
    if (modeController === "bounding-box") {
      handleMouseDownOnImageBB(pos);
    } else if (modeController === "polygon") {
      handleMouseDownOnImagePolygon(pos);
    }
  };
  const handleMouseMoveOnImage = (pos) => {
    if (modeController === "bounding-box") {
      handleMouseMoveOnImageBB(pos);
    } else if (modeController === "polygon") {
      handleMouseMoveOnImagePolygon(pos);
    }
  };

  // POLYGONS IMPLEMENTATION.
  const [polygons, setPolygons] = useState([]);
  const [position, setPosition] = useState(null);
  const [flattenedPoints, setFlattenedPoints] = useState([]);
  const [points, setPoints] = useState([]);
  const [isPolyComplete, setPolyComplete] = useState(false);

  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
  };

  useEffect(() => {
    const _flatten = _.flatten(points.concat(isPolyComplete ? [] : position));
    setFlattenedPoints(_flatten);
    if (isPolyComplete) setPolyComplete(false);
  }, [points, isPolyComplete, position]);
  const handleMouseDownOnFirstPoint = (pos) => {
    if (points.length >= 3) {
      setIsPopupVisible(true);
      setPolyComplete(true);
      setPolygons([
        ...polygons,
        {
          points: points,
        },
      ]);
      setPoints([]);
      return;
    }
  };

  // FUNCTION SUPPORT CLICKING ON LINE --> SUPPORT FUNCTION ONMOUSEDOWN IMAGE POLYGONS.
  // TODO: need more implementation!!! Bug.
  const handleMouseDownOnLine = (e) => {
    // const stage = e.target.getStage();
    // const position = stage.getPointerPosition();
    // setPoints([...points, position]);
  };

  const handleMouseMoveOnImagePolygon = (pos) => {
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

  const handlePolygonDragEnd = (e) => {
    const eChildren = e.target.children;
    const currentLine = eChildren.filter((shapeObject) => {
      if (shapeObject.className === "Line") {
        return shapeObject;
      }
      return null;
    });
    const currentPoints = currentLine[0].attrs.points;
    const pointsArray = currentPoints.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push([array[index], array[index + 1]]);
      }
      return result;
    }, []);
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = pointsArray;
      copyPoints.map((point) => {
        result.push([point[0] + e.target.x(), point[1] + e.target.y()]);
      });
      const newPolygons = polygons.map((pointArr) => {
        if (JSON.stringify(pointArr) === JSON.stringify(copyPoints)) {
          pointArr = result;
        }
        return pointArr;
      });
      setPolygons(newPolygons);
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
    }
  };

  // BOUNDING BOXES IMPLEMENTATION.
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  // Create the default rectangle for drawing.
  const [rect, setRect] = useState({
    id: "0",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  // Check the current bounding box is editing or not.
  const [isEditing, setIsEditing] = useState(false);
  // Width, height for handling dragBoundFunc.
  const [currentDraggingWidth, setCurrentDraggingWidth] = useState(0);
  const [currentDraggingHeight, setCurrentDraggingHeight] = useState(0);

  const _id = String(Math.random());
  const _name = `group-${_id}`;

  const imageUrl =
    "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg";

  const handleMouseMoveOnImageBB = (pos) => {
    if (!isEditing) {
      return;
    }
    if (isEditing) {
      const [x, y] = pos;
      setRect({
        id: String(boundingBoxes.length + 1),
        x: Math.min(rect.x, x),
        y: Math.min(rect.y, y),
        width: Math.abs(rect.x - x),
        height: Math.abs(rect.y - y),
      });
    }
  };

  const handleMouseDownOnRect = (e) => {
    // Mouse down on rect == end drawing a rect.
    if (isEditing) {
      setBoundingBoxes([...boundingBoxes, rect]);
      setRect({
        id: "0",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      setIsEditing(false);
      setIsPopupVisible(true);
    }
  };

  const handleGroupMouseOver = (e) => {
    if (isEditing) return;
    e.target.getStage().container().style.cursor = "move";
  };

  const handleGroupMouseOut = (e) => {
    e.target.getStage().container().style.cursor = "default";
  };

  const handleRectDragEnd = (e) => {
    const newBoundingBox = boundingBoxes.map((boundingBox) => {
      if (boundingBox.id == e.target.id()) {
        boundingBox.x = e.target.x();
        boundingBox.y = e.target.y();
        boundingBox.width = e.target.width();
        boundingBox.height = e.target.height();
      }
      return boundingBox;
    });
    setBoundingBoxes(newBoundingBox);
  };

  const handleRectDragStart = (e) => {
    setCurrentDraggingHeight(e.target.height());
    setCurrentDraggingWidth(e.target.width());
  };
  const rectDragBound = (pos) => {
    let { x, y } = pos;

    if (x < 0) x = 0.1;
    if (y < 0) y = 0.1;
    if (x + currentDraggingWidth > width)
      x = width - currentDraggingWidth + 0.1;
    if (y + currentDraggingHeight > height)
      y = height - currentDraggingHeight + 0.1;
    return { x, y };
  };

  const renderBoundingBoxes = () => {
    if (!boundingBoxes.length) return <></>;
    return boundingBoxes
      .filter((prop) => prop.x !== 0 && prop.y !== 0)
      .map(({ id, x, y, width, height, color }) => {
        return (
          <Group
            id={"group_" + _id}
            name={"bounding_box"}
            draggable={false}
            onMouseOver={handleGroupMouseOver}
            onMouseOut={handleGroupMouseOut}
          >
            <Rect
              onMouseDown={handleMouseDownOnRect}
              onDragStart={handleRectDragStart}
              onDragEnd={handleRectDragEnd}
              dragBoundFunc={rectDragBound}
              key={"rect_" + String(id)}
              id={String(id)}
              x={x}
              y={y}
              draggable={true}
              width={width}
              height={height}
              stroke={"#00F1FF"}
              strokeWidth={3}
              fill={color}
            />
          </Group>
        );
      });
  };

  // MERGING DONE!!!
  // 1. HANDLE EVENT CLICKING ON IMAGE.
  const handleMouseDownOnImageBB = (pos) => {
    // if starting drawing (first click) --> get first location to create rect x, y position.
    if (!isEditing) {
      let [x, y] = pos;
      setRect({
        id: String(boundingBoxes.length + 1),
        x: x,
        y: y,
        width: 1,
        height: 1,
      });
      setIsEditing(true);
      setIsPopupVisible(false);
      return;
    }
    if (isEditing) {
      setBoundingBoxes([...boundingBoxes, rect]);
      setRect({
        id: "0",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
      setIsEditing(false);
      setIsPopupVisible(true);
      return;
    }
  };
  // 2. HANDLE EVENT MOVING ON IMAGE.
  const handleMouseDownOnImagePolygon = (pos) => {
    if (isPolyComplete) return;
    setPoints([...points, pos]);
  };

  // HANDLE IMPORT JSON DATA FILE.
  useEffect(() => {
    setAnnotationData({
      "bounding-box": boundingBoxes,
      polygon: polygons,
    });
  }, [boundingBoxes, polygons]);
  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const data = JSON.parse(content);
        setBoundingBoxes(data["bounding-box"]);
        setPolygons(data["polygon"]);
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  // FIXING UPDATE POLYGONS AFTER DRAGGING.
  useEffect(() => {
    console.log("Polygons tracking");
    console.log(polygons);
  }, [polygons]);

  useEffect(() => {
    console.log("boundingBox tracking");
    console.log(boundingBoxes);
  }, [boundingBoxes]);

  // HANDLE POPUP FORM TO INPUT LABELLING ANNOTATION INFO.
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleSubmitPopupForm = (formData) => {
    // Handle form data here, e.g. update the polygons state
    if (modeController === "bounding-box") {
      const currentLabelItem = boundingBoxes[boundingBoxes.length - 1];
      currentLabelItem["label"] = formData["label"];
      currentLabelItem["color"] = formData["color"] + "7D";
      setBoundingBoxes(
        boundingBoxes.map((boundingBox) => {
          if (boundingBox.id === boundingBox.length - 1) {
            return currentLabelItem;
          }
          return boundingBox;
        })
      );
    } else if (modeController === "polygon") {
      const currentLabelItem = polygons[polygons.length - 1];
      currentLabelItem["label"] = formData["label"];
      currentLabelItem["color"] = formData["color"] + "7D";
      setPolygons(
        polygons.map((polygon, index) => {
          if (index === polygon.length - 1) {
            return currentLabelItem;
          }
          return polygon;
        })
      );
    }
  };

  const handleClosePopupForm = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      <br></br>
      {isPopupVisible && (
        <PopupForm
          onSubmit={handleSubmitPopupForm}
          onClose={handleClosePopupForm}
        />
      )}
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleDownloadClick} disabled={!annotationData}>
        Export JSON
      </button>
      <button
        onClick={(e) => {
          setModeController("bounding-box");
        }}
      >
        BoundingBox
      </button>
      <button
        onClick={(e) => {
          setModeController("polygon");
        }}
      >
        Polygon
      </button>
      <BaseImageComponent
        imageUrl={imageUrl}
        width={width}
        height={height}
        handleMouseDownOnImage={handleMouseDownOnImage}
        handleMouseMoveOnImage={handleMouseMoveOnImage}
      >
        <Layer>
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              isFinished={true}
              flattenedPoints={_.flatten([...polygon["points"]])}
              points={polygon["points"]}
              width={width}
              stroke={"red"}
              height={height}
              fill={polygon.color}
              handlePointDragMove={handlePointDragMove}
              handlePolygonDragEnd={handlePolygonDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              handlePointMouseDown={handleMouseDownOnFirstPoint}
              handleLineMouseDown={handleMouseDownOnLine}
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
            handlePolygonDragEnd={handlePolygonDragEnd}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            handlePointMouseDown={handleMouseDownOnFirstPoint}
            handleLineMouseDown={handleMouseDownOnLine}
          />
          <Rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            stroke="black"
            strokeWidth={3}
            onMouseDown={handleMouseDownOnRect}
          />
          {renderBoundingBoxes()}
        </Layer>
      </BaseImageComponent>
    </>
  );
}

export default AnnotationMerge;
