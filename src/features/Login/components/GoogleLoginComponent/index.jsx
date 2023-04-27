import { useState } from "react";
import PropTypes from "prop-types";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import loginSlice from "../../loginSlice";

function GoogleLoginComponent(props) {
  const dispatch = useDispatch();

  const responseMessage = (response) => {
    console.log("Receive response from gg login");
    console.log(response);
    dispatch(loginSlice.actions.GoogleLogin(response));
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
