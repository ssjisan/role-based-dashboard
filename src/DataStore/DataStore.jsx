import { useLoginData } from "./Component/useLoginData";
import PropTypes from "prop-types";
import { DataContext } from "./DataContext";
import usePageData from "./Component/usePageData";
import useRoleData from "./Component/useRoleData";
import useUserData from "./Component/useUserData";
import usePermissionData from "./Component/usePermissionData";
import usePageGroupData from "./Component/usePageGroupData";

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
    can,
  } = useLoginData();
  const {
    pageLoading,
    pageError,
    pageSuccess,
    createPage,
    updatePage,
    fetchPages,
    fetchPageById,
    setPageError,
    setPageSuccess,
    pages,
    pagesLoading,
    deletePage,
  } = usePageData();
  const { createRole, getRoles, getRoleById, updateRole } = useRoleData();
  const { registerUser } = useUserData();
  const {
    getAccessiblePages,
    fetchRolePermissions,
    hasPermission,
    getPagePermissions,
    currentRole,
    permissionLoading,
    permissionReady,
  } = usePermissionData();
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
        can,
        // Page Data Action
        pageLoading,
        pageError,
        pageSuccess,
        createPage,
        updatePage,
        fetchPages,
        fetchPageById,
        setPageError,
        setPageSuccess,
        pages,
        pagesLoading,
        deletePage,
        // Role Data
        createRole,
        getRoles,
        getRoleById,
        updateRole,
        // User Data
        registerUser,
        // Accessable Pages
        fetchRolePermissions,
        getAccessiblePages,
        hasPermission,
        getPagePermissions,
        currentRole,
        permissionLoading,
        permissionReady,
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
