import axios from "axios";

export default function useUserData() {
  const registerUser = async (data) => {
    try {
      const res = await axios.post("/register", data);
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };
  return { registerUser };
}
