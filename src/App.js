import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";
import Canvas from "./features/Annotation";
// import Button from "./features/Annotation/components/ButtonComponent";
import ImageWithRectangle from "./components/DemoComponent";
import PolygonsAnnotation from "./features/Polygons";
import { Button } from "antd";

const _img =
  "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w.jpg";
function App() {
  return (
    <div className="App">
      <Button>This is a Ant-D Button</Button>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/annotation"> - Annotation</NavLink>
      <NavLink to="/demo-bounding-boxes"> - Demo Bounding Box</NavLink>
      <NavLink to="/test-polygon"> - Demo Polygons</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
        <Route path="/annotation" element={<Canvas />} />
        <Route path="/demo-bounding-boxes" element={<ImageWithRectangle />} />
        <Route
          path="/test-polygon"
          element={<PolygonsAnnotation imageUrl={_img}></PolygonsAnnotation>}
        />
      </Routes>
    </div>
  );
}

export default App;
