import { useContext, useState } from "react";
import Navbar from "../Layout/Navbar";
import { DataContext } from "../DataStore/DataContext";

export default function Roles() {
  const { pages, createRole } = useContext(DataContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState("");
  console.log(permissions);

  const toggleAction = (pageName, action) => {
    setPermissions((prev) => {
      const currentActions = prev[pageName] || [];

      const updatedActions = currentActions.includes(action)
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];

      return {
        ...prev,
        [pageName]: updatedActions,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPermissions = Object.entries(permissions)
      .filter(([page, actions]) => page && actions.length > 0)
      .map(([page, actions]) => ({
        page: String(page),
        actions,
      }));

    const res = await createRole({
      name,
      description,
      permissions: formattedPermissions,
    });

    if (res.success) {
      setMessage("Role created successfully");
      setName("");
      setDescription("");
      setPermissions({});
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Create Role</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <h4>Permissions</h4>

          {pages.map((page) => (
            <details key={page._id} style={{ marginBottom: "10px" }}>
              <summary>
                <strong>{page.name}</strong>
              </summary>

              <div style={{ paddingLeft: "20px" }}>
                {page.availableActions.map((action) => (
                  <label key={action} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={
                        permissions[page.name]?.includes(action) || false
                      }
                      onChange={() => toggleAction(page.name, action)}
                    />
                    {action}
                  </label>
                ))}
              </div>
            </details>
          ))}

          <button type="submit">Create Role</button>
        </form>
      </div>
    </div>
  );
}
