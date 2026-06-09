"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton } from "@/components/ui/frame-button";

export default function JoinPool() {
  const [user, setUser] = useState(null);
  const [stake, setStake] = useState(null);
  const [time, setTime] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleJoin = async () => {
    if (!stake || !time) {
      setMessage("Pick a stake and a time.");
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const poolDate = tomorrow.toISOString().split("T")[0];

    let { data: pool } = await supabase
      .from("pools")
      .select("*")
      .eq("time_slot", time)
      .eq("stake_amount", stake)
      .eq("pool_date", poolDate)
      .single();

    if (!pool) {
      const { data: newPool } = await supabase
        .from("pools")
        .insert({ time_slot: time, stake_amount: stake, pool_date: poolDate })
        .select()
        .single();
      pool = newPool;
    }

    const { error } = await supabase
      .from("pool_entries")
      .insert({ pool_id: pool.id, user_id: user.id });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    await supabase
      .from("profiles")
      .update({ balance: 50 - stake })
      .eq("id", user.id);

    setMessage("Locked in! Redirecting to dashboard...");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  const stakeOptions = [5, 10, 20];
  const timeOptions = ["6:00 AM", "7:00 AM", "8:00 AM"];

  return (
    <div className="min-h-screen text-white p-8 max-w-lg mx-auto w-full">
      <a href="/dashboard" className="text-white/30 text-sm hover:text-white/50 transition-colors">&larr; Dashboard</a>

      <h1 className="text-3xl font-bold tracking-tight mt-6 mb-1">Join Tomorrow&apos;s Pool</h1>
      <p className="text-white/40 text-sm mb-8">Pick your stake and deadline.</p>

      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your stake</p>
        <div className="flex gap-8">
          {stakeOptions.map((amount) => (
            <FrameButton
              key={amount}
              variant="outline"
              className="flex-1 px-0"
              onClick={() => setStake(amount)}
            >
              ${amount}
            </FrameButton>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Wake-up deadline</p>
        <div className="flex gap-8">
          {timeOptions.map((t) => (
            <FrameButton
              key={t}
              variant="outline"
              className="flex-1 px-0"
              onClick={() => setTime(t)}
            >
              {t}
            </FrameButton>
          ))}
        </div>
      </div>

      <FrameButton
        variant="outline"
        className="w-full"
        onClick={handleJoin}
      >
        Lock In
      </FrameButton>

      {message && <p className="mt-4 text-white/40 text-sm">{message}</p>}
    </div>
  );
}
