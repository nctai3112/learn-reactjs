import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { ClimbingBoxLoader } from "react-spinners";
import loginSlice from "../../loginSlice";
import loginResponseSlice from "../../loginResponseSlice";
import axios from "axios";
import { Modal } from "antd";
import './styles.css';

function GoogleLoginComponent(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoadingLogin, setLoadingLogin] = useState(false);
  const [user, setUser] = useState({});

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(loginResponseSlice.actions.AccessToken(codeResponse));
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
    scope:
      "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file",
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
            setLoadingLogin(true);
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
                setLoadingLogin(false);
                dispatch(loginSlice.actions.GoogleLogin(res.data));
                navigate("/projects");
              })
              .catch((error) => {
                Modal.error({
                  title: "ERROR",
                  content: "There is problem with server. Please try again later!",
                });
                setLoadingLogin(false);
              });
          }
        })
        .catch((err) => {
          Modal.error({
            title: "ERROR",
            content: "There is error when you log in. Please try again later!",
          });
        });
    }
  }, [user, dispatch, navigate]);

  return (
    <div className="outer-wrapper">
      {isLoadingLogin ? (
        <ClimbingBoxLoader
          size={30}
          color={"#000"}
          loading={isLoadingLogin}
        />
      ) : (
        <div className="login-container">
          {" "}
          <button className="login-button" onClick={() => login()}>
            Sign in with Google{" "}
          </button>{" "}
        </div>
      )}
    </div>
  );
}

export default GoogleLoginComponent;
