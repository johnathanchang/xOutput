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

  if (loading) return <p className="text-white p-8">Loading...</p>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Not logged in</h1>
        <a href="/login" className="text-green-400 underline">Go to login</a>
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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">xOutput</h1>
      <p className="text-gray-400 mb-6">Welcome, {user.email}</p>

      <div className="bg-gray-900 p-6 rounded-lg mb-6">
        <p className="text-3xl font-bold text-green-400">${balance !== null ? balance.toFixed(2) : "..."}</p>
        <p className="text-gray-400">Your balance</p>
      </div>

      <a href="/timer" className="block bg-green-500 text-center py-4 rounded-lg font-bold text-lg mb-4">
        Start Morning Check-in
      </a>

      <a href="/join" className="block bg-gray-800 text-center py-4 rounded-lg font-bold text-lg mb-4">
        Join Tomorrows Pool
      </a>

      <button onClick={resolvePool} className="w-full py-4 bg-yellow-500 text-black rounded-lg font-bold text-lg mb-4">
        Resolve Pools (Test)
      </button>

      <button onClick={handleLogout} className="px-6 py-3 bg-red-500 rounded-lg font-bold">
        Log Out
      </button>
    </div>
  );
}
