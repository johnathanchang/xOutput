"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleDeposit = async (amount) => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, userId: user.id }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Add Funds</h1>
      <p className="text-gray-400 mb-8">Deposit money to your xOutput balance.</p>

      <div className="flex flex-col gap-4 max-w-md">
        <button onClick={() => handleDeposit(10)} disabled={loading} className="py-4 bg-green-500 rounded-lg font-bold text-xl">
          Deposit $10
        </button>
        <button onClick={() => handleDeposit(20)} disabled={loading} className="py-4 bg-green-500 rounded-lg font-bold text-xl">
          Deposit $20
        </button>
        <button onClick={() => handleDeposit(50)} disabled={loading} className="py-4 bg-green-500 rounded-lg font-bold text-xl">
          Deposit $50
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-400">Redirecting to Stripe...</p>}

      <a href="/dashboard" className="mt-6 block text-green-400 underline">Back to Dashboard</a>
    </div>
  );
}
