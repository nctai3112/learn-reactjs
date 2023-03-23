import React from "react";
import PropTypes from "prop-types";
import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginComponent(props) {
  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div class="google-login">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}

export default GoogleLoginComponent;
