import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../DataStore/DataContext";

const ACTIONS = ["view", "edit", "delete", "create"];

export default function PageForm() {
  const { id } = useParams(); // Get page ID from URL
  const {
    createPage,
    updatePage,
    fetchPageGroups,
    pageGroups,
    fetchPageById,
    pageLoading,
    pageError,
    pageSuccess,
  } = useContext(DataContext);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState();
  const [selectedActions, setSelectedActions] = useState([]);
  const [group, setGroup] = useState("");
  const navigate = useNavigate();
  const toSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const displayedSlug = slug || toSlug(name);

  const handleActionChange = (action) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((a) => a !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  // Load page for edit
  useEffect(() => {
    fetchPageGroups();
    if (id) {
      fetchPageById(id).then((page) => {
        if (page) {
          setName(page.name);
          setSlug(page.slug);
          setDescription(page.description);
          setOrder(page.order);
          setSelectedActions(page.availableActions || []);
          setGroup(page.group?._id || "");
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (id) {
      result = await updatePage(
        id,
        name,
        description,
        selectedActions,
        order,
        group || null
      );
    } else {
      result = await createPage(
        name,
        description,
        selectedActions,
        order,
        group || null
      );
    }

    // ✅ Redirect on successful submit
    if (result?.success) {
      navigate("/pages");
    }
  };

  return (
    <div className="container">
      <h2>{id ? "Edit Page" : "Create Page"}</h2>
      {pageError && <p style={{ color: "red" }}>{pageError}</p>}
      {pageSuccess && <p style={{ color: "green" }}>{pageSuccess}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Page Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Page Slug"
          value={displayedSlug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <textarea
          placeholder="Page Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
        />

        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">No Group</option>
          {pageGroups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

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

        <button type="submit" disabled={pageLoading}>
          {pageLoading ? "Saving..." : id ? "Update Page" : "Save Page"}
        </button>
      </form>
    </div>
  );
}
