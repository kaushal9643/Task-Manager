import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

 // Inside your Login component
const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", data);

    console.log("LOGIN RESPONSE:", res.data); // 🔍 debug

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-3">
          <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}