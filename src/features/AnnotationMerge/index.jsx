import React from "react";
// import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { Layer, Group, Rect, Image } from "react-konva";
import BaseImageComponent from "../BaseImageComponent";
import * as _ from "lodash";
import { Polygon } from "../Polygons/Polygon";
import SelectionList from "../../components/SelectionList";
import { Button, Modal, Form, Input, Divider, Layout, Row, Col } from "antd";
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { currentProjectSelector } from "../../redux/selectors";
import TopBar from "../../components/TopBar";
import Footer from "../../components/Footer";
import { ClimbingBoxLoader } from "react-spinners";
import "./styles.css";

// AnnotationMerge.propTypes = {};

function AnnotationMerge(props) {
  // Add loading state.
  const [isLoading, setLoading] = useState(false);

  const [width, setWidth] = useState(513);
  const [height, setHeight] = useState(513);
  const currentProject = useSelector(currentProjectSelector);
  const { id } = useParams();
  const [scaleRate, setScaleRate] = useState(1);

  const [annotatedResult, setAnnotatedResult] = useState({});

  //default loading the annotation result.
  const [bboxResult, setBBoxResult] = useState([]);
  const [polyResult, setPolyResult] = useState([]);

  // EXPORT ANNOTATION DATA.
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
  const annotationId = currentProject.urlData;

  // GET ANNOTATION DATA FROM GOOGLE DRIVE
  const [currentAnnotationData, setCurrentAnnotationData] = useState([]);
  const getCurrentAnnotationData = (annotationId) => {
    if (annotationId) {
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
          // Handle the response
          const jsonRes = await response.json();
          let data = jsonRes.data;
          let dataJson = data.response.data;
          console.log("request get-json from annotation.json file.")
          console.log(dataJson);

          const fileItem = dataJson.find(
            // (file) => file.id === id && file.annotationData
            (file) => file.id === id
          );
          console.log("id to get annotationData -> return fileItem mapping to current image!");
          console.log(fileItem);

          if (fileItem) {
            console.log("setAnnotationData from fileItem!")
            setAnnotationData(fileItem.annotationData);
            let data = fileItem.annotationData;
            let arrayLabel = [];
            data["bounding_box"].map((boundingBox) => {
              let currentLabelObject = {
                label: boundingBox.label,
                color: boundingBox.color,
              };
              let isExistItem = arrayLabel.some((element) => {
                if (
                  JSON.stringify(element) ===
                  JSON.stringify(currentLabelObject)
                ) {
                  return true;
                }
                return false;
              });
              if (!isExistItem) {
                arrayLabel.push(currentLabelObject);
              }
            });
            data["polygon"].map((boundingBox) => {
              let currentLabelObject = {
                label: boundingBox.label,
                color: boundingBox.color,
              };
              let isExistItem = arrayLabel.some((element) => {
                if (
                  JSON.stringify(element) ===
                  JSON.stringify(currentLabelObject)
                ) {
                  return true;
                }
                return false;
              });
              if (!isExistItem) {
                arrayLabel.push(currentLabelObject);
              }
            });
            setLabelList(arrayLabel);
            if (arrayLabel.length > 0) {
              setSelected(0);
            }
            setBoundingBoxes(fileItem.annotationData['bounding_box']);
            setPolygons(fileItem.annotationData['polygon']);
          }
          if (data.response.data.length > 0) {
            setCurrentAnnotationData(data.response.data);

            // CODE RUN SUCCESS - BUT MET ERROR WHEN GENERATE FULL FLOW CASE - DEBUGGING IMPORT ANNOTATED RESULT.
            const importData = data.response.data[0].annotationData;
            const boundingBoxPredictResult = [];
            const polygonPredictResult = [];
            console.log("importData")
            console.log(importData);
            if (
              Array.isArray(importData["bounding_box"]) &&
              importData["bounding_box"].length > 0
            ) {
              importData["bounding_box"].map((item) => {
                boundingBoxPredictResult.push({
                  id: item.id,
                  predict_result: item.predict_result,
                });
              });
            }
            if (
              Array.isArray(importData["polygon"]) &&
              importData["polygon"].length > 0
            ) {
              importData["polygon"].map((item) => {
                polygonPredictResult.push({
                  id: item.id,
                  predict_result: item.predict_result,
                });
              });
            }
            setAnnotatedResult({
              "bounding_box": boundingBoxPredictResult,
              "polygon": polygonPredictResult
            })
          }
        })
        .catch((error) => {
          // Handle the error
          console.log("Error get json data:");
          console.log(error);
          setCurrentAnnotationData([]);
        });
    }
  };

  // INIT VARIABLES.
  useEffect(() => {
    // if having annotation.json id file -> getCurrentAnnotationData().
    if (annotationId) {
      getCurrentAnnotationData(annotationId);
    }

  }, [annotationId])
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

  // SET ANNOTATION METHOD (DEFAULT: bounding_box)
  const [modeController, setModeController] = useState("bounding_box");

  // HANDLE ANNOTATION EVENT.
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
      if (labelingMethod === "default") {
        setIsPopupVisible(true);
      } else if (labelingMethod === "auto") {
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
      if (labelingMethod === "default") {
        setIsPopupVisible(true);
      } else if (labelingMethod === "auto") {
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
      if (labelingMethod === "default") {
        setIsPopupVisible(true);
      } else if (labelingMethod === "auto") {
        setIsAnnotateAuto(true);
      }
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
    // console.log("set Annotation Data from boundingBoxes + polygons!!")
    // console.log("boundingBoxes");
    // console.log(boundingBoxes);
    setAnnotationData({
      "bounding_box": boundingBoxes,
      "polygon": polygons,
    });
  }, [boundingBoxes, polygons]);

  // useEffect(() => {
  //   console.log("Keep tracking annotation data")
  //   console.log(annotationData);
  // }, [annotationData])

  // IMPORT JSON  FILE HANDLING.
  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const data = JSON.parse(content);
        let arrayLabel = [];
        data["bounding_box"].map((boundingBox) => {
          let currentLabelObject = {
            label: boundingBox.label,
            color: boundingBox.color,
          };
          let isExistItem = arrayLabel.some((element) => {
            if (
              JSON.stringify(element) === JSON.stringify(currentLabelObject)
            ) {
              return true;
            }
            return false;
          });
          if (!isExistItem) {
            arrayLabel.push(currentLabelObject);
          }
        });
        data["polygon"].map((boundingBox) => {
          let currentLabelObject = {
            label: boundingBox.label,
            color: boundingBox.color,
          };
          let isExistItem = arrayLabel.some((element) => {
            if (
              JSON.stringify(element) === JSON.stringify(currentLabelObject)
            ) {
              return true;
            }
            return false;
          });
          if (!isExistItem) {
            arrayLabel.push(currentLabelObject);
          }
        });
        setLabelList(arrayLabel);
        if (arrayLabel.length > 0) {
          setSelected(0);
        }
        setBoundingBoxes(data["bounding_box"]);
        setPolygons(data["polygon"]);
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  // HANDLE POPUP FORM TO INPUT LABELLING ANNOTATION INFO.
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAnnotateAuto, setIsAnnotateAuto] = useState(false);
  const handleSubmitPopupForm = (formData) => {
    // Handle form data here, e.g. update the polygons state
    if (formData["color"]) {
      formData["color"] += "B3";
    }
    setLabelList([...labelList, formData]);
    if (modeController === "bounding_box") {
      // console.log("DEBUGGING...");
      // console.log(boundingBoxes);
      const currentLabelItem = boundingBoxes[boundingBoxes.length - 1];
      currentLabelItem["label"] = formData["label"];
      currentLabelItem["color"] = formData["color"];
      // console.log("setBoundingBoxes");
      setBoundingBoxes(
        boundingBoxes.map((boundingBox) => {
          if (boundingBox.id === boundingBox.length - 1) {
            // console.log("currentLabelItem: ", currentLabelItem);
            return currentLabelItem;
          }
          // console.log("boundingBox: ", boundingBox);
          return boundingBox;
        })
      );
    } else if (modeController === "polygon") {
      const currentLabelItem = polygons[polygons.length - 1];
      currentLabelItem["label"] = formData["label"];
      currentLabelItem["color"] = formData["color"];
      setPolygons(
        polygons.map((polygon, index) => {
          if (index === polygon.length - 1) {
            return currentLabelItem;
          }
          return polygon;
        })
      );
    }
    setIsPopupVisible(false);
  };

  const [selected, setSelected] = useState(-1);
  const [labelList, setLabelList] = useState([]);
  const handleSubmitAddLabelItem = (submitData) => {
    setLabelList([
      ...labelList,
      {
        label: submitData["label"],
        color: submitData["color"] + "B3",
      },
    ]);
  };

  const [labelingMethod, setLabelingMethod] = useState("default");
  // SELECT LIST TRACKING ITEM
  useEffect(() => {
    if (isAnnotateAuto) {
      if (selected !== -1) {
        const formData = labelList[selected];
        if (modeController === "bounding_box") {
          const currentLabelItem = boundingBoxes[boundingBoxes.length - 1];
          currentLabelItem["label"] = formData["label"];
          currentLabelItem["color"] = formData["color"];
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
          currentLabelItem["color"] = formData["color"];
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

  const handleSaveDataAnnotation = (e) => {
    const annotationDataDataData = currentAnnotationData;
    // console.log("Click save annotation data")
    // console.log(annotationData);
    const newAnnotation = annotationDataDataData.map((annotationItem) => {
      if (annotationItem.id === id) {
        annotationItem.annotationData = annotationData;
        annotationItem.annotationData.scaleRate = scaleRate;
      }
      return annotationItem;
    });

    if (newAnnotation && newAnnotation.length > 0) {
      console.log("update json 3!!!")
      console.log(newAnnotation);
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
          const jsonRes = await response.json();
          let data = jsonRes.data;
          console.log("Update annotation.json success!");
        })
        .catch((error) => {
          // Handle the error
          console.log("Error update annotation.json");
          console.log(error);
        });
    }
  }

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
          // Handle the response
          const jsonRes = await response.json();
          let data = jsonRes.data;
          // Checking the result response from AI model.
          console.log("Data response from calling AI model!!!")
          console.log(data);
          setLoading(false);
          // COMMENT FOR UPDATING APP.
          // if (data && data.response.encoded_prediction) {
          //   // PROCESS RESPONSE DATA ANNOTATION HERE.
          //   setAnnotatedResult({
          //     "bounding_box": [
          //       {
          //         "id": "1",
          //         "predict_result": data.response.encoded_prediction,
          //       }
          //     ]
          //   })
          // }
        })
        .catch((error) => {
          // Handle the error
          setLoading(false);
          console.log("Error annotating imagee!");
          console.log(error);
        });
    }
  };

  useEffect(() => {
    console.log("Updating the result...")
    console.log(annotatedResult);
    if (annotatedResult && Object.keys(annotatedResult).length > 0) {
      console.log("This is annotatedResult: ");
      console.log(annotatedResult);
      const annotationDataDataData = currentAnnotationData;

      if (
        Array.isArray(annotatedResult["bounding_box"]) &&
        annotatedResult["bounding_box"].length > 0
      ) {
        annotatedResult["bounding_box"].map((annotatedBBox) => {
          if (annotatedBBox.predict_result) {
            const imageObjBB = new window.Image();
            imageObjBB.src = `data:image/jpeg;base64,${annotatedBBox.predict_result}`;
            console.log("setBBoxResult...");
            setBBoxResult([...bboxResult, imageObjBB]);
          }
        });
      }
      if (
        Array.isArray(annotatedResult["polygon"]) &&
        annotatedResult["polygon"].length > 0
      ) {
        annotatedResult["polygon"].map((annotatedPolygon) => {
          if (annotatedPolygon.predict_result) {
            const imageObjPoly = new window.Image();
            imageObjPoly.src = `data:image/jpeg;base64,${annotatedPolygon.predict_result}`;
            console.log("setPolygons...");
            setPolyResult([...polyResult, imageObjPoly]);
          }
        });
      }

      if (annotationDataDataData && Array.isArray(annotationDataDataData)) {
        const newAnnotation = annotationDataDataData.map((annotationItem) => {
          if (annotationItem.id === id) {
            // ADDING THE ANNOTATION RESULT.
            // const newAnnotationData = annotationData;
            const bounding_box = annotationData["bounding_box"];
            const polygon = annotationData["polygon"];
            if (bounding_box.length > 0) {
              const addBoundingBoxResult = bounding_box.map((item) => {
                console.log("considering bounding box item..");
                console.log(item);
                console.log("array bounding_box result:");
                console.log(annotatedResult["bounding_box"]);
                if (annotatedResult['bounding_box']) {
                  const matchingItem = annotatedResult["bounding_box"].find(
                    (newItem) => newItem.id == item.id
                  );
                  console.log(matchingItem);
                  console.log("Return result:");
                  console.log({ ...item, ...matchingItem });
                  return { ...item, ...matchingItem };
                }
                return {...item}
              });
              annotationItem.annotationData["bounding_box"] =
                addBoundingBoxResult;
            }

            if (polygon.length > 0) {
              const addPolygonResult = polygon.map((item) => {
                if (annotatedResult[polygon] && Array.isArray(annotatedResult[polygon])) {
                  const matchingItem = annotatedResult[polygon].find(
                    (newItem) => newItem.id === item.id
                  );
                  return { ...item, ...matchingItem };
                }
                return {...item};
              });
              annotationItem.annotationData["polygon"] = addPolygonResult;
            }
            annotationItem.annotationData.scaleRate = scaleRate;
            // Old code to save annotationData.
            // annotationItem.annotationData = annotationData;
          }
          return annotationItem;
        });
              console.log("Calling update result annotation done");
              console.log(newAnnotation);
              if (newAnnotation.length == 0) {
                console.log("Bug here 2");
              }
              if (newAnnotation && newAnnotation.length > 0) {
                console.log("Update new annotation 4...");
                console.log(newAnnotation);
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
                    const jsonRes = await response.json();
                    let data = jsonRes.data;
                    console.log("Add result to annotation.json success!");
                  })
                  .catch((error) => {
                    // Handle the error
                    console.log("Error add result annotation.json");
                    console.log(error);
                  });
              }
      }
    }
  }, [annotatedResult])

  const handleScaleRateFromBaseImage = (data) => {
    setScaleRate(data);
  }

  const [showAnnotated, setShowAnnotated] = useState(false);
  const [annotateStatus, setAnnotateStatus] = useState("Show Annotate")

  const changeAnnotateStatus = (e) => {
    if (showAnnotated === false) {
      setShowAnnotated(true);
      setAnnotateStatus("Hide Annotate")
    }
    else {
      setShowAnnotated(false);
      setAnnotateStatus("Show Annotate");
    }
  }

  return (
    <div className="outer-wrapper">
      {isLoading ? (
        <ClimbingBoxLoader size={30} color={"#000"} loading={isLoading} />
      ) : (
        <div
          key={id}
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <TopBar
            topText={`Projects / ${currentProject.title} / Annotation Image`}
          />
          <Divider className="custom-divider" />
          <Row gutter={[16, 16]}>
            <Col span={6} className="sidebar">
              <div className="column">
                <div className="header">
                  <div className="add-label-form function-item">
                    <p className="item-title">Add Label Item</p>
                    <div className="item-content">
                      <Form onFinish={handleSubmitAddLabelItem}>
                        <Form.Item label="Label" name="label" required>
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item label="Color" name="color" required>
                          <Input type="color" />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Add
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="body">
                  <div className="select-list-label-region">
                    {labelList.length === 0 ? (
                      <h2></h2>
                    ) : (
                      <h2>Labeling List</h2>
                    )}
                    <SelectionList
                      key={id}
                      items={labelList}
                      selected={selected}
                      onChange={setSelected}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12} className="column-wrapper">
              <div className="middle-column">
                <div className="header">
                  <div className="function-controller">
                    <div className="annotation-method function-item">
                      <p className="item-title">Annotation Method</p>
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
                          />
                          <span className="button-polygon-text">Polygon</span>
                        </Button>
                      </div>
                    </div>
                    <div className="labeling-method function-item">
                      <p className="item-title">Labeling Method</p>
                      <div className="item-content">
                        <Button
                          type={
                            labelingMethod === "default" ? "primary" : "default"
                          }
                          className="default-label-method"
                          onClick={(e) => {
                            setLabelingMethod("default");
                          }}
                        >
                          Create New Label
                        </Button>
                        <Button
                          type={
                            labelingMethod === "auto" ? "primary" : "default"
                          }
                          className="auto-label-method"
                          onClick={(e) => {
                            setLabelingMethod("auto");
                          }}
                        >
                          Label From Select List
                        </Button>
                        <Modal
                          title="Label Information"
                          open={isPopupVisible}
                          onCancel={() => setIsPopupVisible(false)}
                          footer={null}
                        >
                          <Form onFinish={handleSubmitPopupForm}>
                            <Form.Item label="Label" name="label" required>
                              <Input type="text" />
                            </Form.Item>
                            <Form.Item label="Color" name="color" required>
                              <Input type="color" />
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Save
                              </Button>
                            </Form.Item>
                          </Form>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="body-annotate">
                  <BaseImageComponent
                    sendScaleRateToParent={handleScaleRateFromBaseImage}
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

                    {showAnnotated &&
                      bboxResult.map((imageBBItem) => (
                        <Layer>
                          <Image
                            image={imageBBItem}
                            width={width}
                            height={height}
                            scaleX={scaleRate}
                            scaleY={scaleRate}
                            opacity={0.2}
                          />
                        </Layer>
                      ))}
                    {showAnnotated &&
                      polyResult.map((imagePolyItem) => (
                        <Layer>
                          <Image
                            image={imagePolyItem}
                            width={width}
                            height={height}
                            scaleX={scaleRate}
                            scaleY={scaleRate}
                            opacity={0.2}
                          />
                        </Layer>
                      ))}
                    {/* {base64str.trim().length > 0 ? (
                  <Layer>
                    <Image
                      image={annotatedImage}
                      width={width}
                      height={height}
                      scaleX={scaleRate}
                      scaleY={scaleRate}
                      opacity={0.5}
                    />
                  </Layer>
                ) : (
                  ""
                )} */}
                  </BaseImageComponent>
                </div>
              </div>
            </Col>
            <Col span={6} className="sidebar-right">
              <div className="column">
                <div className="header">
                  <div className="json-data function-item">
                    <p className="item-title">Save Data</p>
                    <div className="item-content">
                      {/* <div className="import-json">
                    <label className="button-import" for="import">
                      Import
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      id="import"
                      onChange={handleFileChange}
                      hidden
                    />
                  </div>
                  <div className="export-json">
                    <Button
                      onClick={handleDownloadClick}
                      disabled={!annotationData}
                    >
                      Export
                    </Button>
                  </div> */}
                      <div className="save-json">
                        <Button onClick={handleSaveDataAnnotation}>
                          Save Annotation
                        </Button>
                      </div>
                      <div className="annotate">
                        <Button onClick={annotateImage}>Annotate Image</Button>
                      </div>
                      <div className="annotate-status">
                        <Button onClick={changeAnnotateStatus}>
                          {annotateStatus}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="body"></div>
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
