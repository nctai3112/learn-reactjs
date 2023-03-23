import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";
import Canvas from "./features/Annotation";
// import Button from "./features/Annotation/components/ButtonComponent";

function App() {
  return (
    <div className="App">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/annotation">Annotation</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
        <Route path="/annotation" element={<Canvas />} />
      </Routes>
    </div>
  );
}

export default App;
