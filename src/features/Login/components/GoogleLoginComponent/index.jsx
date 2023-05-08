import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import loginSlice from "../../loginSlice";
import axios from "axios";

function GoogleLoginComponent(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  // const responseMessage = (response) => {
  //   if (response !== undefined && response !== null) {
  //     setUser(response);
  //     if (profile) {
  //       console.log(profile);
  //       dispatch(loginSlice.actions.GoogleLogin(profile));
  //     }
  //     navigate("/create-project");
  //   }
  // };
  // const errorMessage = (error) => {
  //   console.log(error);
  // };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          console.log("setProfile")
          if (res.data) {
            setProfile(res.data);
            fetch(
              "http://localhost:5000/authors",
              {
                method: "POST",
                headers: {
                  Accept: "*/*",
                  Connection: "keep-alive",
                  "Content-Type": "application/json",
                  "user-agent": "Chrome",
                },
                body: JSON.stringify({
                  name: res.data.name,
                  email: res.data.email,
                }),
              }
            )
              .then((response) => {
                // Handle the response
                // ...
                console.log("Response");
                console.log(response);
              })
              .catch((error) => {
                // Handle the error
                console.log("This this error");
                console.log(error);
              });
          }
          dispatch(loginSlice.actions.GoogleLogin(profile));
          navigate("/create-project");
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // // log out function to log the user out of google and set the profile array to null
  // const logOut = () => {
  //   googleLogout();
  //   setProfile(null);
  // };

  return (
    <div className="login-container">
      {" "}
      <button className="login-button" onClick={() => login()}>
        Sign in with Google{" "}
      </button>
      {" "}
    </div>
    // <div className="google-login">
    //   <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    // </div>
  );
}

export default GoogleLoginComponent;
