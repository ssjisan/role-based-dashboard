import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../DataStore/DataContext";
const ACTIONS = ["view", "edit", "delete", "create"];

export default function PageForm() {
  const {
    createPage,
    pageLoading,
    pageError,
    pageSuccess,
    fetchPageGroups,
    pageGroups,
  } = useContext(DataContext);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState();
  const [selectedActions, setSelectedActions] = useState([]);
  const [group, setGroup] = useState("");

  const toSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Determine what to show in the input
  const displayedSlug = slug || toSlug(name);

  const handleActionChange = (action) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((a) => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  useEffect(() => {
    fetchPageGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createPage(
      name,
      description,
      selectedActions,
      order,
      group || null
    );

    if (result?.suggestedOrder) {
      setOrder(result.suggestedOrder);
    }

    if (result?.success) {
      setName("");
      setSlug("");
      setDescription("");
      setOrder(0);
      setSelectedActions([]);
      setGroup("");
    }
  };
  return (
    <div className="container">
      <h2>Create Page</h2>

      {pageError && <p style={{ color: "red" }}>{pageError}</p>}
      {pageSuccess && <p style={{ color: "green" }}>{pageSuccess}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Page Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Page Slug"
            value={displayedSlug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Page Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
          />
        </div>
        <div>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">No Group</option>

            {pageGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Available Actions:</p>
          {ACTIONS.map((action) => (
            <label key={action} style={{ marginRight: "12px" }}>
              <input
                type="checkbox"
                checked={selectedActions.includes(action)}
                onChange={() => handleActionChange(action)}
              />
              {action}
            </label>
          ))}
        </div>

        <button type="submit" disabled={pageLoading}>
          {pageLoading ? "Saving..." : "Save Page"}
        </button>
      </form>
    </div>
  );
}
