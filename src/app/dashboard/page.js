"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton, FrameMarkers } from "@/components/ui/frame-button";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
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
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
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

      <div className="frame-group relative overflow-visible border border-[1.5px] border-white/30 bg-[var(--card)] p-6 mb-6 text-white">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Balance</p>
        <p className="text-4xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)]">
          ${balance !== null ? balance.toFixed(2) : "..."}
        </p>
        <FrameMarkers size={16} offset={6} />
      </div>

      <div className="space-y-3">
        <FrameButton
          variant="default"
          className="w-full"
          onClick={() => window.location.href = "/timer"}
        >
          Start Morning Check-in
        </FrameButton>

        <FrameButton
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = "/join"}
        >
          Join Tomorrow&apos;s Pool
        </FrameButton>

        <FrameButton
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = "/deposit"}
        >
          Add Funds
        </FrameButton>

        <button
          onClick={resolvePool}
          className="w-full py-3.5 border border-[#A9A9B0] text-center rounded-xl font-medium text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          Resolve Pools (Test)
        </button>
      </div>
    </div>
  );
}
