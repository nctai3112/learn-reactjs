// import React, { useState } from "react";
// import { Line, Circle, Group, Rect } from "react-konva";
// import { minMax, dragBoundFunc } from "./../../../../utils";

// class App extends Component {
//   state = {
//     cursor: {
//       x: null,
//       y: null,
//     },
//     rectangles: [],
//   };
//   handleClick = (e) => {
//     const newRect = {
//       width: 100,
//       height: 100,
//       fill: Konva.Util.getRandomColor(),
//       x: e.target.getStage().getPointerPosition().x,
//       y: e.target.getStage().getPointerPosition().y,
//     };
//     const rectangles = [...this.state.rectangles, newRect];
//     this.setState({ rectangles });
//   };
//   handleMouseMove = (e) => {
//     var stage = e.currentTarget;
//     stage = this.stageRef.getStage();
//     stage = e.target.getStage();
//     this.setState({
//       cursor: stage.getPointerPosition(),
//     });
//   };

//   render() {
//     const text = `cursor position : ${this.state.cursor.x}, ${this.state.cursor.y}`;
//     return (
//       <Stage
//         onMouseDown={this.handleClick}
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseMove={this.handleMouseMove}
//         ref={(ref) => {
//           this.stageRef = ref;
//         }}
//       >
//         <Layer>
//           <Text text={text} x={50} y={100} fontSize={20} />
//           {this.state.rectangles.map((shape) => (
//             <Rect {...shape} />
//           ))}
//         </Layer>
//       </Stage>
//     );
//   }
// }

// // /**
// //  *
// //  * @param {minMaxX} props
// //  * minMaxX[0]=>minX
// //  * minMaxX[1]=>maxX
// //  *
// //  */
// // const RectangleAnnotation = (props) => {
// //   const {
// //     points,
// //     flattenedPoints,
// //     isFinished,
// //     handlePointDragMove,
// //     handleGroupDragEnd,
// //     handleMouseOverStartPoint,
// //     handleMouseOutStartPoint,
// //   } = props;
// //   const vertexRadius = 6;

// //   const [stage, setStage] = useState();

// //   // TAI: handle event move mouse to set the new target point of the line.
// //   const handleGroupMouseOver = (e) => {
// //     console.log("HANDLEGROUPMOUSEOVER");
// //     if (!isFinished) return;
// //     e.target.getStage().container().style.cursor = "move";
// //     setStage(e.target.getStage());
// //   };
// //   const handleGroupMouseOut = (e) => {
// //     console.log("HANDLEGROUPMOUSEOUT");
// //     e.target.getStage().container().style.cursor = "default";
// //   };
// //   const [minMaxX, setMinMaxX] = useState([0, 0]); //min and max in x axis
// //   const [minMaxY, setMinMaxY] = useState([0, 0]); //min and max in y axis
// //   const handleGroupDragStart = (e) => {
// //     console.log("HANDLEGROUPDRAGSTART");
// //     let arrX = points.map((p) => p[0]);
// //     let arrY = points.map((p) => p[1]);
// //     setMinMaxX(minMax(arrX));
// //     setMinMaxY(minMax(arrY));
// //   };
// //   const groupDragBound = (pos) => {
// //     console.log("GROUPDRAGBOUND");
// //     let { x, y } = pos;
// //     const sw = stage.width();
// //     const sh = stage.height();
// //     if (minMaxY[0] + y < 0) y = -1 * minMaxY[0];
// //     if (minMaxX[0] + x < 0) x = -1 * minMaxX[0];
// //     if (minMaxY[1] + y > sh) y = sh - minMaxY[1];
// //     if (minMaxX[1] + x > sw) x = sw - minMaxX[1];
// //     return { x, y };
// //   };
// //   return (
// //     <Group
// //       name="rectangle"
// //       draggable={isFinished}
// //       onDragStart={handleGroupDragStart}
// //       onDragEnd={handleGroupDragEnd}
// //       dragBoundFunc={groupDragBound}
// //       onMouseOver={handleGroupMouseOver}
// //       onMouseOut={handleGroupMouseOut}
// //     >
// //       <Rect
// //         points={flattenedPoints}
// //         stroke="#00F1FF"
// //         strokeWidth={3}
// //         closed={isFinished}
// //         fill="rgb(140,30,255,0.5)"
// //       />
// //       {points.map((point, index) => {
// //         const x = point[0] - vertexRadius / 2;
// //         const y = point[1] - vertexRadius / 2;
// //         const startPointAttr =
// //           index === 0
// //             ? {
// //                 hitStrokeWidth: 12,
// //                 onMouseOver: handleMouseOverStartPoint,
// //                 onMouseOut: handleMouseOutStartPoint,
// //               }
// //             : null;
// //         return (
// //           <Circle
// //             key={index}
// //             x={x}
// //             y={y}
// //             radius={vertexRadius}
// //             fill="#FF019A"
// //             stroke="#00F1FF"
// //             strokeWidth={2}
// //             draggable
// //             onDragMove={handlePointDragMove}
// //             dragBoundFunc={(pos) =>
// //               dragBoundFunc(stage.width(), stage.height(), vertexRadius, pos)
// //             }
// //             {...startPointAttr}
// //           />
// //         );
// //       })}
// //     </Group>
// //   );
// // };

// export default RectangleAnnotation;
