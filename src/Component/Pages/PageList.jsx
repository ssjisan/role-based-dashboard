import { useContext, useState } from "react";
import { DataContext } from "../../DataStore/DataContext";
import { Link } from "react-router-dom";

export default function PageList() {
  const { pages, pagesLoading, deletePage, hasPermission } =
    useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const canCreatePage = hasPermission("Pages", "create");
  const canEdit = hasPermission("Pages", "edit");
  const canDelete = hasPermission("Pages", "delete");
  const handleDeleteClick = (page) => {
    setSelectedPage(page);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!canDelete) {
      setShowError("You do not have permission to delete this page.");
      setShowModal(false);

      return;
    }

    if (selectedPage) {
      await deletePage(selectedPage._id);
      setShowModal(false);
      setSelectedPage(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedPage(null);
  };

  if (pagesLoading) return <p>Loading pages...</p>;
  return (
    <div className="container">
      <h2>Pages List</h2>
      <p style={{ color: "red" }}>{showError}</p>
      {canCreatePage && (
        <Link to="/create-page">
          <button>Create New Page</button>
        </Link>
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Order</th>
            <th style={thStyle}>Group</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "10px" }}>
                No pages found
              </td>
            </tr>
          )}
          {pages.map((page, index) => (
            <tr key={page._id} style={trStyle}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{page.name}</td>
              <td style={tdStyle}>/{page.slug}</td>
              <td style={tdStyle}>{page.description}</td>
              <td style={tdStyle}>{page.order}</td>
              <td style={tdStyle}>{page.group?.name || "-"}</td>
              <td style={tdStyle}>
                {canEdit && (
                  <Link style={btnStyle} to={`/edit-page/${page._id}`}>
                    Edit
                  </Link>
                )}
                {canDelete && (
                  <button
                    style={btnStyle}
                    onClick={() => handleDeleteClick(page)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <p>Are you sure you want to delete "{selectedPage?.name}"?</p>
            <button style={btnStyle} onClick={handleConfirmDelete}>
              Yes, Delete
            </button>
            <button style={btnStyle} onClick={handleCancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
};
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
  textAlign: "center",
};
