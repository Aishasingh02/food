import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {

  const authToken = localStorage.getItem("authToken");


  if(authToken)
  {
    return children;
  }
  else
  {
    return <Navigate to="/login" />;
  }

}
