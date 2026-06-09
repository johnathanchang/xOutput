"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount"));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", authData.user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: profile.balance + amount })
          .eq("id", authData.user.id);
        setDone(true);
      }
    };
    if (amount) updateBalance();
  }, [amount]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-6">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Deposit Successful</h1>
      <p className="text-white/40 text-sm mb-8">${amount} has been added to your balance.</p>
      <a
        href="/dashboard"
        className="px-8 py-3.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

export default function DepositSuccess() {
  return (
    <Suspense fallback={<p className="text-white/40 p-8 text-sm">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
