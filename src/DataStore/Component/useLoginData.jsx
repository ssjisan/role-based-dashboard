import { useState } from "react";
import axios from "axios";

export const useLoginData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("rbac_auth_token", response.data.token);

        // Save user info to localStorage
        localStorage.setItem(
          "rbac_user_info",
          JSON.stringify(response.data.user)
        );

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
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

  return {
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    getToken,
    loading,
    error,
    setError,
  };
};
