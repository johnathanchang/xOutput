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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">Morning Check-in</h1>

      <div className={`text-8xl font-bold mb-8 ${failed ? "text-red-500" : ""}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-full h-4 mb-8">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${failed ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: ((300 - secondsLeft) / 300) * 100 + "%" }}
        ></div>
      </div>

      {!completed && !isRunning && !failed && (
        <button onClick={startTimer} className="px-8 py-4 bg-green-500 rounded-lg font-bold text-xl">
          Start
        </button>
      )}

      <p className={`mt-6 ${failed ? "text-red-400" : "text-gray-400"}`}>{message}</p>

      {(completed || failed) && (
        <a href="/dashboard" className="mt-4 text-green-400 underline text-lg">
          Back to Dashboard
        </a>
      )}
    </div>
  );
}