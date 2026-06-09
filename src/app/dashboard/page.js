"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user) {
        setUser(authData.user);

        const { data: profile } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", authData.user.id)
          .single();

        if (profile) setBalance(profile.balance);
      }

      setLoading(false);
    };
    loadDashboard();
  }, []);

  if (loading) return <p className="text-white/40 p-8 text-sm">Loading...</p>;

  if (!user) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-3">Not logged in</h1>
          <a href="/login" className="text-white/40 text-sm hover:text-white/60 transition-colors">Go to login &rarr;</a>
        </div>
      </div>
    );
  }

  const resolvePool = async () => {
    const res = await fetch("/api/resolve");
    const data = await res.json();
    alert(JSON.stringify(data));
    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen text-white p-8 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">xOutput</h1>
          <p className="text-white/30 text-sm">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/30 text-sm hover:text-white/60 transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Balance</p>
        <p className="text-4xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)]">
          ${balance !== null ? balance.toFixed(2) : "..."}
        </p>
      </div>

      <div className="space-y-3">
        <a
          href="/timer"
          className="block w-full py-3.5 bg-white text-black text-center rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Start Morning Check-in
        </a>

        <a
          href="/join"
          className="block w-full py-3.5 border border-[var(--input-border)] text-center rounded-xl font-medium text-sm text-white hover:bg-white/5 transition-colors"
        >
          Join Tomorrow&apos;s Pool
        </a>

        <a
          href="/deposit"
          className="block w-full py-3.5 border border-[var(--input-border)] text-center rounded-xl font-medium text-sm text-white hover:bg-white/5 transition-colors"
        >
          Add Funds
        </a>

        <button
          onClick={resolvePool}
          className="w-full py-3.5 border border-white/[0.06] text-center rounded-xl font-medium text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          Resolve Pools (Test)
        </button>
      </div>
    </div>
  );
}
