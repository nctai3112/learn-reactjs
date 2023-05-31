import React from "react";
import GoogleLoginComponent from "./components/GoogleLoginComponent";
import "./styles.css"

function LoginFeature(props) {
  return (
    <div className="login-page">
      <div className="left-section">
        <h1 className="intro-title">MEDICAL ANNOTATION</h1>
        <h2 className="intro-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum
          massa id metus condimentum, in euismod nisi consectetur.
        </h2>
      </div>
      <div className="vertical-line"></div>
      <div className="right-section">
        <GoogleLoginComponent />
      </div>

      {/* <h2>Login Page</h2>
      <GoogleLoginComponent /> */}
    </div>
  );
}

export default LoginFeature;
