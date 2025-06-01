import React from "react";
import { Navigate , Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const ProtectedRoute = () => {
    const { currentUser, isLoading } = useUser();

    if(isLoading){
        return <div>Loading...</div>;
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;