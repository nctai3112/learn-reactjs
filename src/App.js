import "./App.css";
import { Route, NavLink, Routes, Router } from "react-router-dom";
import LoginFeature from "./features/Login";
// import Canvas from "./features/Annotation";
import AnnotationMerge from "./features/AnnotationMerge";
// import DemoPage from "./features/Demo";

// const _img =
//   "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_TloZTearsOfTheKingdom_Gamepage_image1600w.jpg";
// function App() {
//   return (
//     <div className="App">
//       <NavLink to="/login">Login</NavLink>
//       <NavLink to="/annotation"> - Annotation</NavLink>

//       <Routes>
//         <Route path="/login" element={<LoginFeature />} />
//         <Route path="/annotation" element={<AnnotationMerge />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import PrivateRoutes from "./utils/PrivateRoutes";
import Project from "./features/Project";

function App() {
  return (
    <div className="demo-app">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/create-project">- Project</NavLink>
      <NavLink to="/annotation"> - Annotation</NavLink>

      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Project />} path="/create-project" exact />
          <Route element={<AnnotationMerge />} path="/annotation" exact />
        </Route>

        <Route element={<LoginFeature />} path="/login" />
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
