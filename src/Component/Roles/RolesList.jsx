import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../DataStore/DataContext";

export default function RolesList() {
  const { getRoles, hasPermission } = useContext(DataContext);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const canCreatePage = hasPermission("Role", "create");
  const canEdit = hasPermission("Role", "edit");
  const canDelete = hasPermission("Role", "delete");
  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data || []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      // Call delete API here, e.g.,
      // await axios.delete(`/role/${id}`)
      // Then refresh list
      console.log("Deleted role", id);
    }
  };

  if (loading) return <p>Loading roles...</p>;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Roles List</h2>
        {canCreatePage && (
          <Link to="/create-roles">
            <button style={btnStyle}>Create Role</button>
          </Link>
        )}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Role Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                No roles found
              </td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={role._id} style={trStyle}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{role.name}</td>
                <td style={tdStyle}>{role.description}</td>
                <td style={tdStyle}>
                  {canEdit && (
                    <Link to={`/edit-role/${role._id}`} style={btnStyle}>
                      Edit
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(role._id)}
                      style={btnStyle}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const trStyle = {
  borderBottom: "1px solid #ddd",
};

const btnStyle = {
  marginRight: "8px",
  padding: "4px 10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  textDecoration: "none",
};
