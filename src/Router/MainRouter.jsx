import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Pages from "../Pages/Pages/Pages";
import Roles from "../Pages/Roles";
import User from "../Pages/User";
import PageGroup from "../Pages/PageGroup";
import CreatePages from "../Pages/Pages/CreatePages";

export default function MainRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/user" element={<User />} />
        <Route path="/page-group" element={<PageGroup />} />
        <Route path="/create-page" element={<CreatePages />} />
      </Route>
    </Routes>
  );
}
