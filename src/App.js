import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";
import Canvas from "./features/Annotation";
import AnnotationMerge from "./features/AnnotationMerge";
import DemoPage from "./features/Demo";
import DragAndDrop from "./features/Demo/component/AnnotationAnt";

const _img =
  "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w.jpg";
function App() {
  return (
    <div className="App">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/annotation"> - Annotation</NavLink>
      <NavLink to="/drag-and-drop"> - DragDrop</NavLink>
      {/* <NavLink to="/annotation-ant"> - Annotation Ant</NavLink> */}
      <NavLink to="/demo-annotation-merge"> - Demo Annotation Merge</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
        <Route path="/annotation" element={<Canvas />} />
        <Route path="/drag-and-drop" element={<DragAndDrop />} />
        {/* <Route path="/annotation-ant" element={<DemoPage />} /> */}
        <Route path="/demo-annotation-merge" element={<AnnotationMerge />} />
      </Routes>
    </div>
  );
}

export default App;
