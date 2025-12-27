import { useState } from "react";
import api from "../axios";

export default function usePageGroupData() {
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [pageGroups, setPageGroups] = useState([]);

  const createPageGroup = async (payload) => {
    setGroupLoading(true);
    setGroupError("");

    try {
      const res = await api.post("/page-group", payload);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create page group";
      setGroupError(msg);
      return { success: false, message: msg };
    } finally {
      setGroupLoading(false);
    }
  };
  const fetchPageGroups = async () => {
    try {
      const res = await api.get("/all-page-groups");
      if (res.data.success) {
        setPageGroups(res.data.groups);
      }
    } catch (err) {
      console.error("Failed to load page groups", err.message);
    }
  };
  return {
    createPageGroup,
    groupLoading,
    groupError,
    pageGroups,
    fetchPageGroups,
  };
}
