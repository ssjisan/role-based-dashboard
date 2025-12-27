import { useState } from "react";
import usePermissionData from "./usePermissionData";
import api from "../axios";

export const useLoginData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { fetchRolePermissions } = usePermissionData();

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Save token to localStorage
        localStorage.setItem("rbac_auth_token", token);

        // Save user info to localStorage
        localStorage.setItem("rbac_user_info", JSON.stringify(user));

        // Fetch and save role permissions
        if (user.role) {
          await fetchRolePermissions(user.role.$oid || user.role);
        }

        return {
          success: true,
          user,
          token,
        };
      } else {
        setError(response.data.message || "Login failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("rbac_auth_token");
    localStorage.removeItem("rbac_user_info");
    localStorage.removeItem("rbac_role_info");
    window.location.href = "/login";
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem("rbac_auth_token");
  };

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("rbac_user_info");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Get token
  const getToken = () => {
    return localStorage.getItem("rbac_auth_token");
  };

  // Initialize user session on app start
  const initializeSession = async () => {
    const user = getCurrentUser();
    if (user?.role) {
      await fetchRolePermissions(user.role.$oid || user.role);
    }
  };

  return {
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    getToken,
    initializeSession,
    loading,
    error,
    setError,
  };
};
