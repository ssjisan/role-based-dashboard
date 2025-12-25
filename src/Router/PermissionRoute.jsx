import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../DataStore/DataContext";
import { routePermissions } from "../DataStore/Component/routePermissions";

export default function PermissionRoute() {
  const { hasPermission, permissionLoading, permissionReady } =
    useContext(DataContext);

  const location = useLocation();

  // ⛔ WAIT until permissions are ready
  if (permissionLoading || !permissionReady) {
    return null; // or <FullPageLoader />
  }

  const matched = Object.entries(routePermissions).find(([path]) =>
    matchPath(path, location.pathname)
  );

  if (!matched) return <Outlet />;

  const [, { page, action }] = matched;

  if (!hasPermission(page, action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
