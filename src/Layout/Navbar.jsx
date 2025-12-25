import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../DataStore/DataContext";

export default function Navbar() {
  const {
    isLoggedIn,
    logout,
    pages,
    getAccessiblePages,
    pageGroups,
    fetchPageGroups,
  } = useContext(DataContext);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    fetchPageGroups(); // fetch all groups from backend
  }, []);

  if (!isLoggedIn()) return null;

  const accessiblePageNames = getAccessiblePages();

  // Only pages the user has access to, sorted by order
  const filteredPages = pages
    .filter((p) => accessiblePageNames.includes(p.name))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Pages without a group
  const ungroupedPages = filteredPages.filter((p) => !p.group?._id);

  // Map pages to their groups using _id
  const pagesByGroupId = {};
  pageGroups.forEach((group) => {
    pagesByGroupId[group._id] = filteredPages
      .filter((p) => p.group?._id === group._id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", gap: "20px", position: "relative" }}>
        {/* Ungrouped pages */}
        {ungroupedPages.map((p) => (
          <Link key={p._id} to={`/${p.slug}`} style={{ fontWeight: "bold" }}>
            {p.name}
          </Link>
        ))}

        {pageGroups.map((group) => {
          const groupPages = pagesByGroupId[group._id] || [];
          if (groupPages.length === 0) return null; // skip empty groups
          return (
            <div key={group._id} style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setOpenGroup(openGroup === group._id ? null : group._id)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                  fontWeight: "bold",
                }}
              >
                {group.name}
              </button>

              {openGroup === group._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    minWidth: "160px",
                  }}
                >
                  {groupPages.map((p) => (
                    <Link
                      key={p._id}
                      to={`/${p.slug}`}
                      style={{
                        display: "block",
                        padding: "8px 12px",
                        textDecoration: "none",
                        color: "#333",
                      }}
                      onClick={() => setOpenGroup(null)}
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          padding: "6px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </nav>
  );
}
