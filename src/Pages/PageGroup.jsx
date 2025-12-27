import { useContext, useState } from "react";
import { DataContext } from "../DataStore/DataContext";

export default function PageGroup() {
  const { createPageGroup, groupLoading, groupError } = useContext(DataContext);

  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createPageGroup({
      name,
      order,
    });

    if (res.success) {
      setMessage("Page group created successfully");
      setName("");
      setOrder(0);
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div>
      <div style={{ maxWidth: "500px", margin: "40px auto" }}>
        <h2>Create Page Group</h2>

        {message && <p>{message}</p>}
        {groupError && <p style={{ color: "red" }}>{groupError}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit" disabled={groupLoading}>
            {groupLoading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
