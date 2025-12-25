import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Pages from "../Pages/Pages/Pages";
import User from "../Pages/User";
import PageGroup from "../Pages/PageGroup";
import CreatePages from "../Pages/Pages/CreatePages";
import EditPages from "../Pages/Pages/EditPages";
import EditRoles from "../Pages/Roles/EditRoles";
import CreateRoles from "../Pages/Roles/CreateRoles";
import Roles from "../Pages/Roles/Roles";
import Test from "../Pages/Test";
import PermissionRoute from "./PermissionRoute";

export default function MainRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<PermissionRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/test" element={<Test />} />
          <Route path="/create-roles" element={<CreateRoles />} />
          <Route path="/edit-role/:id" element={<EditRoles />} />
          <Route path="/user" element={<User />} />
          <Route path="/page-group" element={<PageGroup />} />
          <Route path="/create-page" element={<CreatePages />} />
          <Route path="/edit-page/:id" element={<EditPages />} />
        </Route>
      </Route>
    </Routes>
  );
}
