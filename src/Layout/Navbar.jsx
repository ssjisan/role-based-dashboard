import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../DataStore/DataContext";

export default function Navbar() {
  const { isLoggedIn, logout, pages, getAccessiblePages } =
    useContext(DataContext);

  if (!isLoggedIn()) return null;
  const accessiblePageNames = getAccessiblePages(); // ["Dashboard", "Pages", "Roles"]

  const filteredPages = pages.filter((p) =>
    accessiblePageNames.includes(p.name)
  );

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
      {/* LEFT */}
      <div style={{ display: "flex", gap: "20px" }}>
        {filteredPages.map((p) => (
          <Link key={p._id} to={`/${p.slug}`}>
            {" "}
            {p.name}
          </Link>
        ))}
      </div>

      {/* RIGHT */}
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
