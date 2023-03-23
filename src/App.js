import "./App.css";
import { Route, NavLink, Routes } from "react-router-dom";
import LoginFeature from "./features/Login";

function App() {
  return (
    <div className="App">
      <NavLink to="/login">Login</NavLink>

      <Routes>
        <Route path="/login" element={<LoginFeature />} />
      </Routes>
    </div>
  );
}

export default App;
