import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const API_BASE = "https://stringz.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/";

    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="text-gray-200 text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition transform hover:scale-105"
          >
            Log In
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-300 underline hover:text-purple-400">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}
