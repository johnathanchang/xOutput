"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Join Tomorrow's Pool</h1>
      <p className="text-gray-400 mb-6">Pick your stake and deadline.</p>

      <p className="mb-3">Your stake:</p>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setStake(5)} className={`px-6 py-3 rounded-lg font-bold ${stake === 5 ? "bg-green-500" : "bg-gray-800"}`}>$5</button>
        <button onClick={() => setStake(10)} className={`px-6 py-3 rounded-lg font-bold ${stake === 10 ? "bg-green-500" : "bg-gray-800"}`}>$10</button>
        <button onClick={() => setStake(20)} className={`px-6 py-3 rounded-lg font-bold ${stake === 20 ? "bg-green-500" : "bg-gray-800"}`}>$20</button>
      </div>

      <p className="mb-3">Wake-up deadline:</p>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTime("6:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "6:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>6:00 AM</button>
        <button onClick={() => setTime("7:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "7:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>7:00 AM</button>
        <button onClick={() => setTime("8:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "8:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>8:00 AM</button>
      </div>

      <button onClick={handleJoin} className="w-full py-4 bg-green-500 rounded-lg font-bold text-lg mb-4">
        Lock In
      </button>

      {message && <p className="mt-4 text-gray-400">{message}</p>}

      <a href="/dashboard" className="text-green-400 underline">Back to Dashboard</a>
    </div>
  );
}