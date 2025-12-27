import api from "../axios";

export default function useRoleData() {
  const createRole = async (roleData) => {
    try {
      const res = await api.post("/create-role", roleData);
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create role",
      };
    }
  };
  const getRoles = async () => {
    const res = await api.get("/roles");
    return res.data.roles;
  };

  const getRoleById = async (id) => {
    try {
      const res = await api.get(`/role/${id}`);
      return res.data.success ? res.data.role : null;
    } catch (err) {
      console.error("Error fetching role:", err);
      return null;
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const res = await api.put(`/edit-role/${id}`, roleData);
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update role",
      };
    }
  };

  return {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
  };
}
