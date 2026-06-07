"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome, {user.email}</p>

      <div className="bg-gray-900 p-6 rounded-lg mb-4">
        <p className="text-2xl font-bold text-green-400">$0.00</p>
        <p className="text-gray-400">Your balance</p>
      </div>

      <button onClick={handleLogout} className="px-6 py-3 bg-red-500 rounded-lg font-bold">
        Log Out
      </button>
    </div>
  );
}