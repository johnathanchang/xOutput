"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function Timer() {
  const [user, setUser] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("Tap Start to begin your 5-minute check-in.");
  const intervalRef = useRef(null);
  const graceRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isRunning) {
        clearInterval(intervalRef.current);
        setIsRunning(false);

        graceRef.current = setTimeout(() => {
          setFailed(true);
          setMessage("You left for too long. You lost your stake.");
          handleFail();
        }, 15000);

      } else if (!document.hidden && !failed) {
        if (graceRef.current) {
          clearTimeout(graceRef.current);
          graceRef.current = null;
          setMessage("Close call! Tap Start to resume.");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isRunning, failed]);

  const startTimer = () => {
    if (completed || failed) return;
    setIsRunning(true);
    setMessage("Stay on this page...");
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setCompleted(true);
          handleCheckIn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCheckIn = async () => {
    if (!user) return;

    const { data: entry } = await supabase
      .from("pool_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("checked_in", false)
      .limit(1)
      .single();

    if (entry) {
      await supabase
        .from("pool_entries")
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq("id", entry.id);

      setMessage("You're checked in! You kept your money.");
    } else {
      setMessage("No active pool found.");
    }
  };

  const handleFail = async () => {
    if (!user) return;

    const { data: entry } = await supabase
      .from("pool_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("checked_in", false)
      .limit(1)
      .single();

    if (entry) {
      await supabase
        .from("pool_entries")
        .update({ checked_in: false, checked_in_at: new Date().toISOString() })
        .eq("id", entry.id);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((300 - secondsLeft) / 300) * 100;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Morning Check-in</p>

      <div className={`text-7xl font-bold tracking-tighter mb-10 font-[family-name:var(--font-geist-mono)] ${failed ? "text-red-400" : "text-white"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full max-w-xs h-1 bg-white/[0.06] rounded-full mb-10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${failed ? "bg-red-400" : "bg-white"}`}
          style={{ width: progress + "%" }}
        />
      </div>

      {!completed && !isRunning && !failed && (
        <button
          onClick={startTimer}
          className="px-10 py-3.5 bg-white text-black rounded-xl font-medium text-sm hover:bg-white/90 transition-colors"
        >
          Start
        </button>
      )}

      <p className={`mt-8 text-sm ${failed ? "text-red-400/80" : "text-white/30"}`}>{message}</p>

      {(completed || failed) && (
        <a href="/dashboard" className="mt-4 text-white/40 text-sm hover:text-white/60 transition-colors">
          Back to Dashboard &rarr;
        </a>
      )}
    </div>
  );
}
