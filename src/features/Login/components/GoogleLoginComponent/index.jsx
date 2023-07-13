import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import loginSlice from "../../loginSlice";
import loginResponseSlice from "../../loginResponseSlice";
import axios from "axios";
import { Modal } from "antd";
import { current } from "@reduxjs/toolkit";
import './styles.css';

function GoogleLoginComponent(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState([]);

  const [currentError, setCurrentError] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("codeResponse:")
      console.log("dispatchAccessToken")
      console.log(codeResponse)
      dispatch(loginResponseSlice.actions.AccessToken(codeResponse));
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (Object.keys(user).length > 0) {
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
                console.log("Login Success!")
                console.log(res);
                dispatch(loginSlice.actions.GoogleLogin(res.data));
                navigate("/projects");
              })
              .catch((error) => {
                Modal.error({
                  title: "ERROR",
                  content: "There is problem with server. Please try again later!",
                });
                setCurrentError(true);
              });
          }
        })
        .catch((err) => {
          Modal.error({
            title: "ERROR",
            content: "There is error when you log in. Please try again later!",
          })
          setCurrentError(true);
        });
    }
  }, [user]);

  return (
    <div className="login-container">
      {" "}
      <button className="login-button" onClick={() => login()}>
        Sign in with Google{" "}
      </button>
      {" "}
    </div>
  );
}

export default GoogleLoginComponent;
