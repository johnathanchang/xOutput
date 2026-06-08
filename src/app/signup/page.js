"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Sign up for xOutput</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full max-w-md p-3 mb-4 bg-gray-800 rounded-lg"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full max-w-md p-3 mb-4 bg-gray-800 rounded-lg"
      />

      <button
        onClick={handleSignup}
        className="px-6 py-3 bg-green-500 rounded-lg font-bold"
      >
        Sign Up
      </button>

      {message && <p className="mt-4 text-gray-400">{message}</p>}
      <a href="/login" className="mt-4 text-green-400 underline">Already have an account? Log in</a>
    </div>
  );
}