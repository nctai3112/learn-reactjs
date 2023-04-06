import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";
import Canvas from "./features/Annotation";
// import Button from "./features/Annotation/components/ButtonComponent";
import ImageWithRectangle from "./components/DemoComponent";
import PolygonsAnnotation from "./features/Polygons";

const _img =
  "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w.jpg";
function App() {
  return (
    <div className="App">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/annotation"> - Annotation</NavLink>
      <NavLink to="/demo-bounding-boxes"> - Demo Bounding Box</NavLink>
      <NavLink to="/test-polygon"> - Demo Polygons</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
        <Route path="/annotation" element={<Canvas />} />
        <Route path="/demo-bounding-boxes" element={<ImageWithRectangle />} />
        <Route path="/demo-toolbar-image" element={<KonvaToolbar />} />
        <Route path="/demo-image-render" element={<KonvaImage />} />
        <Route
          path="/test-polygon"
          element={<PolygonsAnnotation imageUrl={_img}></PolygonsAnnotation>}
        />
      </Routes>
    </div>
  );
}

export default App;
