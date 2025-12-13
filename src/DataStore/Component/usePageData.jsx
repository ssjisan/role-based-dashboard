import { useEffect, useState } from "react";
import axios from "axios";

export default function usePageData() {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageSuccess, setPageSuccess] = useState("");
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);

  const toSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Create Page Function (now with availableActions)
  const createPage = async (
    name,
    description,
    availableActions = [],
    order,
    group = null
  ) => {
    setPageLoading(true);
    setPageError("");
    setPageSuccess("");

    try {
      const slug = toSlug(name);

      const response = await axios.post("/create-page", {
        name,
        slug,
        description,
        availableActions,
        order,
        group, // ✅ include group
      });

      if (response.data.success) {
        setPageSuccess("Page created successfully");
        fetchPages();
        return { success: true };
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.suggestedOrder) {
        setPageError(
          `${data.message}. Suggested order: ${data.suggestedOrder}`
        );
        return { success: false, suggestedOrder: data.suggestedOrder };
      }
      setPageError(data?.message || "Error creating page");
      return { success: false };
    } finally {
      setPageLoading(false);
    }
  };

  const fetchPages = async () => {
    setPagesLoading(true);
    try {
      const res = await axios.get("/pages-list");
      if (res.data.success) {
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
    setPagesLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return {
    pageLoading,
    pageError,
    pageSuccess,
    createPage,
    setPageError,
    setPageSuccess,
    fetchPages,
    pages,
    pagesLoading,
  };
}
