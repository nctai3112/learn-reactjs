import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";
import Canvas from "./features/Annotation";
import AnnotationDemo from "./features/AnnotationDemo";
import ComponentDemo from "./components/DemoComponent";
// import Button from "./features/Annotation/components/ButtonComponent";

import RenderComponent from "./features/AnnotationDemo/components/Stage";
import PropagationControl from "./features/AnnotationDemo/components/PropagationControl";
// import PlayControl from "./features/AnnotationDemo/components/PlayControl";
import ModeController from "./features/AnnotationDemo/components/ModeController";
import ImageWithRectangle from "./components/DemoComponent";

function App() {
  return (
    <div className="App">
      {/* <Canvas /> */}

      <NavLink to="/login">Login</NavLink>
      {/* <NavLink to="/annotation">Annotation</NavLink> */}
      {/* <NavLink to="/annotation-demo">Annotation Demo</NavLink> */}
      <NavLink to="/demo">Component Demo</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
        {/* <Route path="/annotation" element={<Canvas />} /> */}
        {/* <Route path="/annotation-demo" element={<AnnotationDemo />} /> */}
        <Route path="/demo" element={<ImageWithRectangle />} />
      </Routes>
    </div>
  );
}

export default App;
