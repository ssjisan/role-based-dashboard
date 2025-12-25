import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function usePermissionData() {
  const [currentRole, setCurrentRole] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionReady, setPermissionReady] = useState(false);

  // Fetch role from API
  const fetchRolePermissions = async (roleId) => {
    try {
      setPermissionLoading(true);
      const res = await axios.get(`/role/${roleId}`);

      if (res.data.success) {
        const role = res.data.role;
        localStorage.setItem("rbac_role_info", JSON.stringify(role));
        setCurrentRole(role);
        return role;
      }
    } catch (err) {
      console.error("Error fetching role:", err);
    } finally {
      setPermissionLoading(false);
    }
  };

  // Normalize permissions (VERY IMPORTANT)
  const permissionMap = useMemo(() => {
    if (!currentRole?.permissions) return {};

    return currentRole.permissions.reduce((acc, p) => {
      acc[p.page] = new Set(p.actions);
      return acc;
    }, {});
  }, [currentRole]);

  // Permission check
  const hasPermission = (page, action) => {
    return Boolean(permissionMap[page]?.has(action));
  };

  // Page actions
  const getPagePermissions = (page) => {
    return permissionMap[page] ? Array.from(permissionMap[page]) : [];
  };

  const getAccessiblePages = () => Object.keys(permissionMap);

  // Hydrate role from localStorage ONCE
  useEffect(() => {
    const cached = localStorage.getItem("rbac_role_info");

    if (cached) {
      try {
        setCurrentRole(JSON.parse(cached));
      } catch (e) {
        console.error("Invalid cached role", e.message);
      }
    }

    // ✅ Mark permissions as ready AFTER hydration
    setPermissionReady(true);
  }, []);

  return {
    fetchRolePermissions,
    hasPermission,
    getPagePermissions,
    getAccessiblePages,
    currentRole,
    permissionLoading,
    permissionReady,
  };
}
