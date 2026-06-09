"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton } from "@/components/ui/frame-button";

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

  const amounts = [10, 20, 50];

  return (
    <div className="min-h-screen text-white p-8 max-w-lg mx-auto w-full">
      <a href="/dashboard" className="text-white/30 text-sm hover:text-white/50 transition-colors">&larr; Dashboard</a>

      <h1 className="text-3xl font-bold tracking-tight mt-6 mb-1">Add Funds</h1>
      <p className="text-white/40 text-sm mb-8 normal-case tracking-normal">Deposit money to your xOutput balance.</p>

      <div className="space-y-8">
        {amounts.map((amount) => (
          <FrameButton
            key={amount}
            variant="outline"
            className="w-full"
            onClick={() => handleDeposit(amount)}
            disabled={loading}
          >
            Deposit ${amount}
          </FrameButton>
        ))}
      </div>

      {loading && <p className="mt-6 text-white/30 text-sm">Redirecting to Stripe...</p>}
    </div>
  );
}
