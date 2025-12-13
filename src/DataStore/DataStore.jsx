import axios from "axios";
import { useLoginData } from "./Component/useLoginData";
import PropTypes from "prop-types";
import { DataContext } from "./DataContext";
import usePageData from "./Component/usePageData";
import useRoleData from "./Component/useRoleData";
import useUserData from "./Component/useUserData";
import usePermissionData from "./Component/usePermissionData";
import usePageGroupData from "./Component/usePageGroupData";
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default function DataStore({ children }) {
  const {
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    getToken,
    loading,
    error,
    setError,
  } = useLoginData();
  const {
    pageLoading,
    pageError,
    pageSuccess,
    createPage,
    setPageError,
    setPageSuccess,
    pages,
    pagesLoading,
  } = usePageData();
  const { createRole, getRoles } = useRoleData();
  const { registerUser } = useUserData();
  const { getAccessiblePages, fetchRolePermissions } = usePermissionData();
  const {
    createPageGroup,
    groupLoading,
    groupError,
    pageGroups,
    fetchPageGroups,
  } = usePageGroupData();
  return (
    <DataContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        getToken,
        loading,
        error,
        setError,
        // Page Data Action
        pageLoading,
        pageError,
        pageSuccess,
        createPage,
        setPageError,
        setPageSuccess,
        pages,
        pagesLoading,
        // Role Data
        createRole,
        getRoles,
        // User Data
        registerUser,
        // Accessable Pages
        getAccessiblePages,
        fetchRolePermissions,
        // Page Group
        createPageGroup,
        groupLoading,
        groupError,
        pageGroups,
        fetchPageGroups,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
DataStore.propTypes = {
  children: PropTypes.node.isRequired,
};
