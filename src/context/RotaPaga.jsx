import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";


const RotaPaga = ({ children }) => {
  const { user, assinaturaExpirada, statusAssinatura } = useUserAuth();



  if (assinaturaExpirada || statusAssinatura !== "ativo") {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default RotaPaga;