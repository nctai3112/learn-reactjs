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
  }, [googleLoginData, navigate]);

  return (
    <div className="login-page">
      <div className="left-section">
        <h1 className="intro-title">MEDICAL ANNOTATION</h1>
        <h3 className="intro-text">
          Our website supports annotate image with AI model 13 labels including: <br></br>
          Right Adrenal Gland, Esophagus, Aorta, Stomach, Pancreas, Right
          kidney, Gallbladder, Left Kidney, Inferior Vena Cava, Liver, Spleen,
          Left Adrenal Gland, Duodenum
        </h3>
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
