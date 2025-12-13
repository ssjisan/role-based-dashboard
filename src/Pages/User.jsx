import { useContext, useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import { DataContext } from "../DataStore/DataContext";

export default function User() {
  const { registerUser, getRoles } = useContext(DataContext);

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      const data = await getRoles();
      setRoles(data);
    };
    loadRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser(form);
    if (res.success) {
      setMessage("User registered successfully");
      setForm({ name: "", email: "", password: "", role: "" });
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Create User</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>

          <button type="submit">Register User</button>
        </form>
      </div>
    </div>
  );
}
