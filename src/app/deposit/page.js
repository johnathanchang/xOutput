"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton } from "@/components/ui/frame-button";

export default function Deposit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

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

        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full py-4 pl-8 pr-4 bg-transparent border-[1.5px] border-white/30 text-white text-sm font-medium tracking-[0.2em] uppercase placeholder:text-white/20 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-white/60"
            />
          </div>
          <FrameButton
            variant="outline"
            className="whitespace-nowrap"
            disabled={loading}
            onClick={() => {
              const parsed = parseFloat(customAmount);
              if (!parsed || parsed < 1) return;
              handleDeposit(parsed);
            }}
          >
            Deposit Custom
          </FrameButton>
        </div>
      </div>

      {loading && <p className="mt-6 text-white/30 text-sm">Redirecting to Stripe...</p>}

      <a href="/welcome" className="block mt-12 text-center text-[10px] text-white normal-case tracking-normal hover:text-white/60 transition-colors">How does xOutput work?</a>
    </div>
  );
}
