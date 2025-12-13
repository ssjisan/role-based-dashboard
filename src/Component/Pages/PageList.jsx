import { useContext } from "react";
import { DataContext } from "../../DataStore/DataContext";
import { Link } from "react-router-dom";

export default function PageList() {
  const { pages, pagesLoading } = useContext(DataContext);

  if (pagesLoading) return <p>Loading pages...</p>;
  return (
    <div className="container">
      <h2>Pages List</h2>
      <Link to="/create-page">
        <button>Create New Page</button>
      </Link>
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
                {/* Actions will come here later */}
                <button style={btnStyle}>Edit</button>
                <button style={btnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
