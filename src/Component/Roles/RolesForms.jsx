import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../../DataStore/DataContext";

export default function RolesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pages, createRole, getRoleById, updateRole } =
    useContext(DataContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState("");

  // Prefill form in edit mode
  useEffect(() => {
    if (id) {
      getRoleById(id).then((role) => {
        if (role) {
          setName(role.name);
          setDescription(role.description);

          const perms = {};
          role.permissions.forEach((p) => {
            perms[p.page] = p.actions;
          });
          setPermissions(perms);
        }
      });
    }
  }, [id]);

  const toggleAction = (pageName, action) => {
    setPermissions((prev) => {
      const currentActions = prev[pageName] || [];
      const updatedActions = currentActions.includes(action)
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];
      return { ...prev, [pageName]: updatedActions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPermissions = Object.entries(permissions)
      .filter(([page, actions]) => page && actions.length > 0)
      .map(([page, actions]) => ({ page: String(page), actions }));

    let res;
    if (id) {
      res = await updateRole(id, {
        name,
        description,
        permissions: formattedPermissions,
      });
    } else {
      res = await createRole({
        name,
        description,
        permissions: formattedPermissions,
      });
    }

    if (res.success) {
      setMessage(
        id ? "Role updated successfully" : "Role created successfully"
      );
      navigate("/roles");
    } else {
      setMessage(res.message);
    }
  };

  // Collect all unique actions across pages for table header
  const allActions = Array.from(
    new Set(pages.flatMap((p) => p.availableActions))
  );

  return (
    <div className="container">
      <h2>{id ? "Edit Role" : "Create Role"}</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <h4>Permissions</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Page</th>
              {allActions.map((action) => (
                <th key={action} style={thStyle}>
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id}>
                <td style={tdStyle}>{page.name}</td>
                {allActions.map((action) => (
                  <td style={tdStyle} key={action}>
                    {page.availableActions.includes(action) ? (
                      <input
                        type="checkbox"
                        checked={
                          permissions[page.name]?.includes(action) || false
                        }
                        onChange={() => toggleAction(page.name, action)}
                      />
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: "20px" }}>
          {id ? "Update Role" : "Create Role"}
        </button>
      </form>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};
