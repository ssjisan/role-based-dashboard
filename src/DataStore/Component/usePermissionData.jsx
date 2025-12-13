import axios from "axios";

export default function usePermissionData() {
  const fetchRolePermissions = async (roleId) => {
    try {
      const res = await axios.get(`/role/${roleId}`);
      if (res.data.success) {
        const role = res.data.role;
        console.log("roleId", role);

        // Store in localStorage for global access
        localStorage.setItem("rbac_role_info", JSON.stringify(role));
        return role;
      }
      return null;
    } catch (err) {
      console.error("Error fetching role:", err);
      return null;
    }
  };

  const getAccessiblePages = () => {
    const roleStr = localStorage.getItem("rbac_role_info");
    if (!roleStr) return [];

    const role = JSON.parse(roleStr);
    return role.permissions.map((p) => p.page);
  };

  return { fetchRolePermissions, getAccessiblePages };
}
