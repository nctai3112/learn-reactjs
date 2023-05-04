import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import loginSlice from "../../loginSlice";

function GoogleLoginComponent(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseMessage = (response) => {
    if (response !== undefined && response !== null) {
      dispatch(loginSlice.actions.GoogleLogin(response));
      navigate("/create-project");
    }
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="google-login">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}

export default GoogleLoginComponent;
