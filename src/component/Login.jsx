import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole } = useAuth();

  // 🔍 Debug: Print token if already saved
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Existing token in localStorage:", token);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://stayfinder-backend-trrx.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("✅ Response from server:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("📦 Token stored in localStorage:", data.token);
      } else {
        console.warn("⚠️ No token received from backend");
      }

      setIsLoggedIn(true);
      setRole(data.role || "");

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {message && (
          <p className="mb-4 text-center text-red-500">{message}</p>
        )}

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
