"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton, FrameMarkers } from "@/components/ui/frame-button";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [streak, setStreak] = useState(0);
  const [activePool, setActivePool] = useState(null);
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

          const { data: entries } = await supabase
            .from("pool_entries")
            .select("pool_id, pools(pool_date, time_slot, stake_amount)")
            .eq("user_id", authData.user.id);

          if (entries && entries.length > 0) {
            const dates = [...new Set(entries.map(e => e.pools?.pool_date).filter(Boolean))].sort().reverse();
            let count = 0;
            const today = new Date();
            const check = new Date(today);
            check.setDate(check.getDate() + 1);
            for (const d of dates) {
              const dateStr = check.toISOString().split("T")[0];
              if (d === dateStr) {
                count++;
                check.setDate(check.getDate() - 1);
              } else {
                const todayStr = today.toISOString().split("T")[0];
                if (count === 0 && d === todayStr) {
                  count++;
                  check.setDate(check.getDate() - 1);
                } else {
                  break;
                }
              }
            }
            setStreak(count);

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];
            const todayStr = today.toISOString().split("T")[0];
            const active = entries.find(e =>
              e.pools?.pool_date === tomorrowStr || e.pools?.pool_date === todayStr
            );
            if (active?.pools) {
              setActivePool(active.pools);
            }
          }
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
          <h1 className="text-2xl font-bold normal-case tracking-normal">xOutput</h1>
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
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Balance</p>
            <p className="text-4xl font-bold tracking-tight font-[family-name:var(--font-geist-mono)]">
              ${balance !== null ? balance.toFixed(2) : "..."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 border border-white/20 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-medium">{streak}-DAY STREAK</span>
            </div>
            {activePool && (
              <p className="text-amber-400 text-[9px] normal-case">
                {activePool.time_slot} pool · ${activePool.stake_amount} at risk
              </p>
            )}
          </div>
        </div>
        <FrameMarkers size={16} offset={6} />
      </div>

      <div className="space-y-8">
        <FrameButton
          variant="outline"
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
