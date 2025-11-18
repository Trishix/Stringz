import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const API_BASE = "https://stringz.onrender.com";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("Account Created! Please Login.");
      window.location.href = "/login";

    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">

          <div>
            <label className="text-gray-200 text-sm">Full Name</label>
            <input
              type="text"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition transform hover:scale-105"
          >
            Sign Up
          </button>

        </form>

        <p className="text-gray-300 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-300 underline hover:text-purple-400">
            Log In
          </Link>
        </p>

      </div>

    </div>
  );
}
