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
    <div className="min-h-screen text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Create account</h1>
        <p className="text-white/40 text-sm mb-8">Sign up to start staking.</p>

        <div className="space-y-3 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 bg-[var(--input-bg)] border border-[#A9A9B0] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-[var(--input-bg)] border border-[#A9A9B0] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Sign Up
        </button>

        {message && <p className="mt-4 text-red-400/80 text-sm">{message}</p>}

        <p className="mt-6 text-center text-white/30 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-white/60 hover:text-white transition-colors">Log in</a>
        </p>
      </div>
    </div>
  );
}
