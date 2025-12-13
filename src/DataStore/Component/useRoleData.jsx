import axios from "axios";

export default function useRoleData() {
  const createRole = async (roleData) => {
    try {
      const res = await axios.post("/create-role", roleData);
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create role",
      };
    }
  };
  const getRoles = async () => {
    const res = await axios.get("/roles");
    return res.data.roles;
  };
  return {
    createRole,
    getRoles,
  };
}
