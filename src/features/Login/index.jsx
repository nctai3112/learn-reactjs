import React from "react";
import GoogleLoginComponent from "./components/GoogleLoginComponent";

function LoginFeature(props) {
  return (
    <div class="login-feature">
      <h2>Login Feature</h2>
      <GoogleLoginComponent />
    </div>
  );
}

export default LoginFeature;
