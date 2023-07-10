import React, { useEffect } from "react";
import GoogleLoginComponent from "./components/GoogleLoginComponent";
import "./styles.css"
import { googleLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LoginFeature(props) {

  const googleLoginData = useSelector(googleLoginSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (googleLoginData) {
      navigate("/projects");
    }
  }, googleLoginData);

  return (
    <div className="login-page">
      <div className="left-section">
        <h1 className="intro-title">MEDICAL ANNOTATION</h1>
        <h2 className="intro-text">
          This is the Demo version for Annotation app. Here, you can upload your
          images to our website and then perform a simple annotation operation
          with them.
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
