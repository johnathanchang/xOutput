"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton } from "@/components/ui/frame-button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/join";
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back</h1>
        <p className="text-white/40 text-sm mb-8 normal-case tracking-normal">Log in to your account.</p>

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

        <FrameButton
          variant="default"
          className="w-full"
          onClick={handleLogin}
        >
          Log In
        </FrameButton>

        {message && <p className="mt-4 text-red-400/80 text-sm">{message}</p>}

        <p className="mt-6 text-center text-white/30 text-sm normal-case tracking-normal">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-white/60 hover:text-white transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  );
}
