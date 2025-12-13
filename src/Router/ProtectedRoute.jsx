import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../DataStore/DataContext";

export default function ProtectedRoute() {
  const { isLoggedIn } = useContext(DataContext);

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
