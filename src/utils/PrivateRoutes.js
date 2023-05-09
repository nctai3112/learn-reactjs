import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { googleLoginSelector } from "../redux/selectors";

const PrivateRoutes = () => {
  const googleLoginData = useSelector(googleLoginSelector);
  return (googleLoginData !== undefined && googleLoginData !== null) ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
