import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    name: "", email: "", password: "", role: "MEMBER"
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    await API.post("/auth/register", data);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input className="input" placeholder="Name"
          onChange={(e) => setData({ ...data, name: e.target.value })} />

        <input className="input" placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })} />

        <input type="password" className="input" placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })} />

        <select className="input"
          onChange={(e) => setData({ ...data, role: e.target.value })}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="btn" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}