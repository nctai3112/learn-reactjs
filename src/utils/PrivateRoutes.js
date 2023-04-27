import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { googleLoginSelector } from "../redux/selectors";

const PrivateRoutes = () => {
  // let auth = { token: false };
  const googleLoginData = useSelector(googleLoginSelector);
  console.log("Demo Reducer");
  console.log(googleLoginData);
  return googleLoginData != undefined ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
