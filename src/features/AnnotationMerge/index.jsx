import React from "react";
import { useState, useEffect, useRef } from "react";
import { Layer, Group, Rect, Image } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import * as _ from "lodash";
import { Polygon } from "../Polygons/Polygon";
import SelectionList from "../../components/SelectionList";
import { Button, Modal, Divider, Row, Col } from "antd";
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { currentProjectSelector } from "../../redux/selectors";
import TopBar from "../../components/TopBar";
import Footer from "../../components/Footer";
import CommentBlock from "./components/CommentBlock";
import { ClimbingBoxLoader } from "react-spinners";
import "./styles.css";

function AnnotationMerge(props) {
  // Param passing from parent.
  const currentProject = useSelector(currentProjectSelector);
  const { id } = useParams();
  const annotationId = currentProject.urlData;
  // Add loading state.
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSaveAnnotation, setLoadingSaveAnnotation] = useState(false);
  const [isLoadingData, setLoadingData] = useState(false);
  // Image scale handling + rendering.
  const [width, setWidth] = useState(513);
  const [height, setHeight] = useState(513);
  const [scaleRate, setScaleRate] = useState(1);
  // Storing annotation result.
  const [annotatedResult, setAnnotatedResult] = useState({});
  // Loading the annotation result.
  const [bboxResult, setBBoxResult] = useState([]);
  const [polyResult, setPolyResult] = useState([]);
  // Storing annotation data - get from json or update when annotate.
  const [annotationData, setAnnotationData] = useState([]);
  // Handle label list default including 13 items.
  const defaultLabelList = [
    {
      label: "Right Adrenal Gland",
      color: "#FFEFD2",
    },
    {
      label: "Esophagus",
      color: "#D7B386",
    },
    {
      label: "Aorta",
      color: "#00FFFF",
    },
    {
      label: "Stomach",
      color: "#2ED1A8",
    },
    {
      label: "Pancreas",
      color: "#FEFF00",
    },
    {
      label: "Right kidney",
      color: "#00CF00",
    },
    {
      label: "Gallbladder",
      color: "#D8822B",
    },
    {
      label: "Left Kidney",
      color: "#008E8C",
    },
    {
      label: "Inferior Vena Cava",
      color: "#FF00FF",
    },
    {
      label: "Liver",
      color: "#9D0000",
    },
    {
      label: "Spleen",
      color: "#3E47F8",
    },
    {
      label: "Left Adrenal Gland",
      color: "#5340FD",
    },
    {
      label: "Duodenum",
      color: "#54508A",
    },
  ];
  // Handle annotate feature.
  const [isAnnotateAuto, setIsAnnotateAuto] = useState(true);
  const [selected, setSelected] = useState(-1);
  const [labelingMethod, setLabelingMethod] = useState("auto");

  // Variable to store all files in current folder - current project folder.
  const [currentAnnotationData, setCurrentAnnotationData] = useState([]);

  // Function to init all values
  // [
  //    setAnnotationData,
  //    setSelected,
  //    setBoundingBoxes,
  //    setPolygons,
  //    setCurrentAnnotationData,
  //    setAnnotatedResult
  // ]

  // IMPLEMENTING - STORE ALL RESULT IN 1 FOLDER DRIVE.
  // LOADING THE annotationData from annotation.json file.
  const getCurrentAnnotationData = (annotationId) => {
    if (annotationId) {
      setLoadingData(true);
      fetch(`http://localhost:5000/drive/get-json/${annotationId}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
      })
        .then(async (response) => {
          const jsonRes = await response.json();
          let data = jsonRes.data;
          let dataJson = data.response.data;

          if (dataJson && Array.isArray(dataJson) && dataJson.length > 0) {
            setCurrentAnnotationData(data.response.data);

            // fileItem: current file chosen from project.
            const fileItem = dataJson.find((file) => file.id === id);
            if (fileItem && fileItem.annotationData) {
              const importData = fileItem.annotationData;
              setAnnotationData(importData);
              setSelected(0);
              setBoundingBoxes(importData["bounding_box"]);
              setPolygons(importData["polygon"]);

              const boundingBoxPredictResult = [];
              const polygonPredictResult = [];
              if (
                Array.isArray(importData["bounding_box"]) &&
                importData["bounding_box"].length > 0
              ) {
                importData["bounding_box"].map((item) => {
                  boundingBoxPredictResult.push({
                    id: item.id,
                    resultFileId: item.resultFileId,
                  });
                  return item;
                });
              }
              if (
                Array.isArray(importData["polygon"]) &&
                importData["polygon"].length > 0
              ) {
                importData["polygon"].map((item) => {
                  polygonPredictResult.push({
                    id: item.id,
                    resultFileId: item.resultFileId,
                  });
                  return item;
                });
              }
              setAnnotatedResult({
                bounding_box: boundingBoxPredictResult,
                polygon: polygonPredictResult,
              });
            }
          }
          setLoadingData(false);
        })
        .catch((error) => {
          setLoadingData(false);
          setCurrentAnnotationData([]);
          console.log("Error get all data relating to current annotate image.");
          console.log(error);
          Modal.error({
            title: "ERROR",
            content: "Error get all data relating to current annotate image, please refresh the page to try again.",
          });
        });
    }
  };

  // INIT VARIABLES - call getCurrentAnnotationData project.
  useEffect(() => {
    // if having annotation.json id file -> get all data relating to project.
    if (annotationId) {
      getCurrentAnnotationData(annotationId);
    }
  }, [annotationId]);

  // INIT VARIABLES - Get image information - width height.
  useEffect(() => {
    // if having file image id --> get image width height and set to width, height state.
    if (id) {
      fetch(`http://localhost:5000/drive/get-json/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
      })
        .then(async (response) => {
          const jsonRes = await response.json();
          if (jsonRes.data.imageInfo) {
            const dataImgInfo = jsonRes.data.imageInfo;
            setWidth(dataImgInfo.width);
            setHeight(dataImgInfo.height);
          }
        })
        .catch((error) => {
          console.log("Error get width height image...");
          console.log(error);
        });
    }
  }, [id]);

  // Set annotation method - default: bounding_box.
  const [modeController, setModeController] = useState("bounding_box");

  // Handle annotation event when clicking on image - click 1, many times.
  const handleMouseDownOnImage = (pos) => {
    if (modeController === "bounding_box") {
      handleMouseDownOnImageBB(pos);
    } else if (modeController === "polygon") {
      handleMouseDownOnImagePolygon(pos);
    }
  };
  const handleMouseMoveOnImage = (pos) => {
    if (modeController === "bounding_box") {
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
      setPolyComplete(true);
      setPolygons([
        ...polygons,
        {
          points: points,
        },
      ]);
      setPoints([]);
      if (labelingMethod === "auto") {
        setIsAnnotateAuto(true);
      }
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
        return point;
      });
      const newPolygons = polygons.map((pointArr) => {
        if (JSON.stringify(pointArr.points) === JSON.stringify(copyPoints)) {
          pointArr.points = result;
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

  const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

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
      if (labelingMethod === "auto") {
        setIsAnnotateAuto(true);
      }
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
            key={id}
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
              stroke={"black"}
              strokeWidth={2}
              fill={color}
            />
          </Group>
        );
      });
  };

  // Event click on image bbox.
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
      return;
    }
  };
  // Event click on image polygon.
  const handleMouseDownOnImagePolygon = (pos) => {
    if (isPolyComplete) return;
    setPoints([...points, pos]);
  };

  // Save annotation data.
  useEffect(() => {
    setAnnotationData({
      bounding_box: boundingBoxes,
      polygon: polygons,
    });
  }, [boundingBoxes, polygons]);

  useEffect(() => {
    if (isAnnotateAuto) {
      if (selected !== -1) {
        const formData = defaultLabelList[selected];
        if (modeController === "bounding_box") {
          const currentLabelItem = boundingBoxes[boundingBoxes.length - 1];
          currentLabelItem["label"] = formData["label"];
          currentLabelItem["color"] = formData["color"] + "B3";
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
          currentLabelItem["color"] = formData["color"] + "B3";
          // Add id for polygons.
          currentLabelItem["id"] = polygons.length;
          setPolygons(
            polygons.map((polygon, index) => {
              if (index === polygon.length - 1) {
                return currentLabelItem;
              }
              return polygon;
            })
          );
        }
      }
      setIsAnnotateAuto(false);
    }
  }, [isAnnotateAuto]);

  // Write annotationData on Drive annotation.json.
  const handleSaveDataAnnotation = (e) => {
    const annotationDataDataData = currentAnnotationData;
    const newAnnotation = annotationDataDataData.map((annotationItem) => {
      if (annotationItem.id === id) {
        annotationItem.annotationData = annotationData;
        annotationItem.annotationData.scaleRate = scaleRate;
      }
      return annotationItem;
    });

    if (newAnnotation && newAnnotation.length > 0) {
      setLoadingSaveAnnotation(true);
      fetch("http://localhost:5000/drive/update-json", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          annotationFileId: annotationId,
          fileContent: JSON.stringify(newAnnotation),
        }),
      })
        .then(async (response) => {
          setLoadingSaveAnnotation(false);
        })
        .catch((error) => {
          // Handle the error
          console.log("Error update annotation.json");
          console.log(error);
          Modal.error({
            title: "ERROR",
            content:
              "Error update annotation information, click the Save Annotation to try again.",
          });
          setLoadingSaveAnnotation(false);
        });
    }
  };

  // Call AI model through Express.
  const annotateImage = (e) => {
    if (annotationId && id) {
      setLoading(true);
      fetch("http://localhost:5000/drive/annotate-image", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Connection: "keep-alive",
          "Content-Type": "application/json",
          "user-agent": "Chrome",
        },
        body: JSON.stringify({
          annotationFileId: annotationId,
          imageFileId: id,
        }),
      })
        .then(async (response) => {
          const jsonRes = await response.json();
          let data = jsonRes.data;
          setLoading(false);
          const boundingBoxResult = [];
          if (data && data.responseBBox && Array.isArray(data.responseBBox)) {
            const bboxResultResponse = data.responseBBox;
            bboxResultResponse.map((resultItem, index) => {
              if (resultItem) {
                boundingBoxResult.push({
                  id: index + 1,
                  resultFileId: resultItem,
                });
              }
            });
          }
          const polygonResult = [];
          if (data && data.responsePolygons && Array.isArray(data.responsePolygons)
          ) {
            const polyResultResponse = data.responsePolygons;
            polyResultResponse.map((resultItem, index) => {
              if (resultItem) {
                polygonResult.push({
                  id: index + 1,
                  resultFileId: resultItem,
                });
              }
              return resultItem
            });
          }
          setAnnotatedResult({
            bounding_box: boundingBoxResult,
            polygon: polygonResult,
          });
          setShowAnnotated(true);
          setAnnotateStatus("Hide Annotation")

        })
        .catch((error) => {
          // Handle the error
          Modal.error({
            title: "ERROR",
            content:
              "Error call AI model for annotating image. Please try again",
          });
          setLoading(false);
          console.log("Error annotating image!");
          console.log(error);
        });
    }
  };

  // Render result annotated if exists.
  // Add result to the annotation.json file.
  //    Update annotation.json file if data valid.

  // IMPLEMENTING
  useEffect(() => {
    if (annotatedResult && Object.keys(annotatedResult).length > 0) {
      const annotationDataDataData = currentAnnotationData;
      // Render result annotated if exists.
      if (
        Array.isArray(annotatedResult["bounding_box"]) &&
        annotatedResult["bounding_box"].length > 0
      ) {
        let arrayBBoxImageResult = [];
        annotatedResult["bounding_box"].map((annotatedBBox) => {
          if (annotatedBBox.resultFileId) {
            let imageObjBB = new window.Image();
            let fileIdEncoded = encodeURIComponent(
              annotatedBBox.resultFileId
            );
            imageObjBB.src = `https://drive.google.com/uc?export=view&id=${fileIdEncoded}`;
            arrayBBoxImageResult.push(imageObjBB);
          }
          return annotatedBBox;
        });
        setBBoxResult(arrayBBoxImageResult);
      }
      if (
        Array.isArray(annotatedResult["polygon"]) &&
        annotatedResult["polygon"].length > 0
      ) {
        let arrayPolyImageResult = [];
        annotatedResult["polygon"].map((annotatedPolygon) => {
          if (annotatedPolygon.resultFileId) {
            let imageObjPoly = new window.Image();
            let imageSrcEncoded = encodeURIComponent(annotatedPolygon.resultFileId);
            imageObjPoly.src = `https://drive.google.com/uc?export=view&id=${imageSrcEncoded}`;
            arrayPolyImageResult.push(imageObjPoly);
          }
          return annotatedPolygon;
        });
        setPolyResult(arrayPolyImageResult);
      }

      // Add result to the annotation.json file.
      if (annotationDataDataData && Array.isArray(annotationDataDataData)) {
        const newAnnotation = annotationDataDataData.map((annotationItem) => {
          if (annotationItem.id === id) {
            const bounding_box = annotationData["bounding_box"];
            const polygon = annotationData["polygon"];
            if (bounding_box.length > 0) {
              const addBoundingBoxResult = bounding_box.map((item) => {
                if (annotatedResult["bounding_box"]) {
                  const matchingItem = annotatedResult["bounding_box"].find(
                    (newItem) => newItem.id == item.id
                  );
                  return { ...item, ...matchingItem };
                }
                return { ...item };
              });
              annotationItem.annotationData["bounding_box"] =
                addBoundingBoxResult;
            }
            if (polygon.length > 0) {
              const addPolygonResult = polygon.map((item) => {
                if (
                  annotatedResult["polygon"] &&
                  Array.isArray(annotatedResult["polygon"])
                ) {
                  const matchingItem = annotatedResult["polygon"].find(
                    (newItem) => newItem.id === item.id
                  );
                  return { ...item, ...matchingItem };
                }
                return { ...item };
              });
              annotationItem.annotationData["polygon"] = addPolygonResult;
            }
            annotationItem.annotationData.scaleRate = scaleRate;
          }
          return annotationItem;
        });

        // Update annotation.json file if data valid.
        if (newAnnotation && newAnnotation.length > 0) {
          fetch("http://localhost:5000/drive/update-json", {
            method: "POST",
            headers: {
              Accept: "*/*",
              Connection: "keep-alive",
              "Content-Type": "application/json",
              "user-agent": "Chrome",
            },
            body: JSON.stringify({
              annotationFileId: annotationId,
              fileContent: JSON.stringify(newAnnotation),
            }),
          })
            .then(async (response) => {
              // Handle the response
              // const jsonRes = await response.json();
              // let data = jsonRes.data;
            })
            .catch((error) => {
              // Handle the error
              Modal.error({title: "ERROR", content: "Error save annotation result to database, please try again."})
              console.log("Error add result annotation.json");
              console.log(error);
            });
        }
      }
    }
  }, [annotatedResult, annotationData, annotationId, currentAnnotationData, id, scaleRate]);

  const handleScaleRateFromBaseImage = (data) => {
    setScaleRate(data);
  };

  const [showAnnotated, setShowAnnotated] = useState(false);
  const [annotateStatus, setAnnotateStatus] = useState("Show Annotate");

  const changeAnnotateStatus = (e) => {
    if (showAnnotated === false) {
      setShowAnnotated(true);
      setAnnotateStatus("Hide Annotate");
    } else {
      setShowAnnotated(false);
      setAnnotateStatus("Show Annotate");
    }
  };

  const sideBarColRef = useRef(null);
  const stepGuideRef = useRef(null);
  const [cmtHeight, setCmtHeight] = useState(0);

  useEffect(() => {
    if (sideBarColRef.current && stepGuideRef.current) {
      setCmtHeight(
        sideBarColRef.current.clientHeight - stepGuideRef.current.clientHeight - 32
      );
    }
  }, []);

  return (
    <div className="outer-wrapper">
      {isLoading || isLoadingSaveAnnotation || isLoadingData ? (
        <ClimbingBoxLoader
          size={30}
          color={"#000"}
          loading={isLoading || isLoadingSaveAnnotation || isLoadingData}
        />
      ) : (
        <div
          key={id}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
          }}
        >
          <TopBar
            topText={`Projects / ${currentProject.title} / Annotation Image`}
            backButton={true}
          />
          <Divider className="custom-divider" />
          <Row gutter={[16, 16]}>
            <Col span={17} className="column-wrapper">
              <div className="middle-column">
                <div className="body-annotate">
                  <BaseImageComponent
                    sendScaleRateToParent={handleScaleRateFromBaseImage}
                    imageUrl={imageUrl}
                    width={width}
                    height={height}
                    handleMouseDownOnImage={handleMouseDownOnImage}
                    handleMouseMoveOnImage={handleMouseMoveOnImage}
                  >
                    {!showAnnotated ? (
                      <Layer>
                        {polygons.map((polygon, index) => (
                          <Polygon
                            key={index}
                            isFinished={true}
                            flattenedPoints={_.flatten([...polygon["points"]])}
                            points={polygon["points"]}
                            width={width}
                            stroke={"black"}
                            height={height}
                            fill={polygon.color}
                            handlePointDragMove={handlePointDragMove}
                            handlePolygonDragEnd={handlePolygonDragEnd}
                            handleMouseOverStartPoint={
                              handleMouseOverStartPoint
                            }
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
                          strokeWidth={2}
                          onMouseDown={handleMouseDownOnRect}
                        />
                        {renderBoundingBoxes()}
                      </Layer>
                    ) : (
                      ""
                    )}

                    {showAnnotated && (
                      <Layer opacity={0.8}>
                        {bboxResult.map((imageBBItem, index) => (
                          <Image
                            key={index}
                            image={imageBBItem}
                            width={width}
                            height={height}
                            scaleX={scaleRate}
                            scaleY={scaleRate}
                          />
                        ))}
                      </Layer>
                    )}
                    {showAnnotated && (
                      <Layer opacity={1}>
                        {polyResult.map((imagePolyItem, index) => (
                          <Image
                            key={index}
                            image={imagePolyItem}
                            width={width}
                            height={height}
                            scaleX={scaleRate}
                            scaleY={scaleRate}
                          />
                        ))}
                      </Layer>
                    )}
                  </BaseImageComponent>
                </div>
                <div className="select-list-label-region">
                  {/* {defaultLabelList.length === 0 ? (
                      <h2></h2>
                    ) : (
                      <h4 className="label-list-text">Label List</h4>
                    )} */}
                  <SelectionList
                    key={id}
                    items={defaultLabelList}
                    selected={selected}
                    onChange={setSelected}
                  />
                </div>
              </div>
            </Col>
            <Col span={7} className="sidebar-right-block" ref={sideBarColRef}>
              <div className="step-guides-block" ref={stepGuideRef}>
                <div className="step-item">
                  <h3 className="step-text">Step 1 Choose Method</h3>
                  <div className="step-content">
                    <div className="item-content">
                      <Button
                        type={
                          modeController === "bounding_box"
                            ? "primary"
                            : "default"
                        }
                        className="button-bounding_box"
                        onClick={(e) => {
                          setModeController("bounding_box");
                        }}
                      >
                        <img
                          src="/icons/rectangle.svg"
                          width="10px"
                          height="10px"
                          alt="Bounding Box"
                        />
                        <span className="button-bounding_box-text">
                          Bounding Box
                        </span>
                      </Button>
                      <Button
                        type={
                          modeController === "polygon" ? "primary" : "default"
                        }
                        className="button-polygon"
                        onClick={(e) => {
                          setModeController("polygon");
                        }}
                      >
                        <img
                          src="/icons/polygon.svg"
                          width="10px"
                          height="10px"
                          alt="Polygon"
                        />
                        <span className="button-polygon-text">Polygon</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <h3 className="step-text">Step 2 Select Label</h3>
                  <div className="step-content">
                    {" "}
                    Choose label for the annotating item below the image
                  </div>
                </div>

                <div className="step-item">
                  <h3 className="step-text">Step 3 Draw Annotation</h3>
                  <div className="step-content"></div>
                </div>

                <div className="step-item">
                  <h3 className="step-text">Step 4 Save Your Work</h3>
                  <div className="step-content">
                    <Button onClick={handleSaveDataAnnotation}>
                      Save Annotation
                    </Button>
                  </div>
                </div>

                <div className="step-item">
                  <h3 className="step-text">Step 5 Call Annotation</h3>
                  <div className="step-content">
                    <Button onClick={annotateImage}>Annotate Image</Button>
                  </div>
                </div>

                <div className="step-item">
                  <h3 className="step-text">Step 6 Show Result</h3>
                  <div className="step-content">
                    <Button onClick={changeAnnotateStatus}>
                      {annotateStatus}
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="comment-region"
                style={{ height: `${cmtHeight}px`}}
              >
                <CommentBlock annotationId={id} commentHeight={cmtHeight}/>
              </div>
            </Col>
          </Row>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default AnnotationMerge;
