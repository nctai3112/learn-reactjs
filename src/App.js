import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";

import LoginFeature from "./features/Login";
import AnnotationMerge from "./features/AnnotationMerge";
import ProjectDetail from "./features/ProjectDetail";
import PrivateRoutes from "./utils/PrivateRoutes";
import Project from "./features/Project";
import UserInformation from "./features/UserInformation";

function App() {
  return (
    <div className="demo-app">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Project />} path="/projects" exact />
          <Route element={<ProjectDetail />} path="/project/:id" exact />
          <Route element={<AnnotationMerge />} path="/annotation/:id" exact />
          <Route element={<UserInformation />} path="/user" />
        </Route>

        <Route element={<LoginFeature />} path="/" />
      </Routes>
    </div>
  );
}
export default App;
