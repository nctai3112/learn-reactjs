import "./App.css";
import { Route, NavLink, Routes, Router } from "react-router-dom";
import LoginFeature from "./features/Login";
import AnnotationMerge from "./features/AnnotationMerge";
import ProjectDetail from "./features/ProjectDetail";
import Home from "./features/Home";

import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import PrivateRoutes from "./utils/PrivateRoutes";
import Project from "./features/Project";
import SendAPI from "./features/SendAPI";

function App() {
  return (
    <div className="demo-app">
      {/* <NavLink to="/login">Login</NavLink>
      <NavLink to="/projects">- Project</NavLink> */}
      {/* <NavLink to="/project-detail"> - Project Detail</NavLink> */}
      {/* <NavLink to="/annotation"> - Annotation</NavLink> */}

      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Project />} path="/projects" exact />
          <Route element={<ProjectDetail />} path="/project/:id" exact />
          <Route element={<AnnotationMerge />} path="/annotation/:id" exact />
        </Route>

        <Route element={<LoginFeature />} path="/" />
        <Route element={<SendAPI />} path="/send-api"/>
      </Routes>
    </div>
  );

  // return (
  //   <div className="app-container">
  //     <h1 className="app-name">Medical Annotation</h1>
  //     <br />
  //     {profile ? (
  //       <div>
  //         <img src={profile.picture} alt="user avatar" />
  //         <h3>User Logged in</h3>
  //         <p>Name: {profile.name}</p>
  //         <p>Email Address: {profile.email}</p>
  //         <br />
  //         <br />
  //         <button onClick={logOut}>Log out</button>
  //       </div>
  //     ) : (
  //       <div className="login-container">
  //         <button className="login-button" onClick={() => login()}>
  //           Sign in with Google
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
}
export default App;
