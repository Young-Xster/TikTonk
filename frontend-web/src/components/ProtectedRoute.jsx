import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import Loading from "./Loading.jsx";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
