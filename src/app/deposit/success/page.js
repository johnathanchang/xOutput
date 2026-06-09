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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Deposit Successful!</h1>
      <p className="text-gray-400 text-lg mb-6">${amount} added to your balance.</p>
      <a href="/dashboard" className="px-8 py-4 bg-green-500 rounded-lg font-bold text-xl">
        Go to Dashboard
      </a>
    </div>
  );
}

export default function DepositSuccess() {
  return (
    <Suspense fallback={<p className="text-white p-8">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
