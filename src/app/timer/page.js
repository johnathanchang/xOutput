"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { FrameButton } from "@/components/ui/frame-button";

export default function Timer() {
  const [user, setUser] = useState(null);
  const [entry, setEntry] = useState(null);
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
      if (!data.user) return;

      const today = new Date().toISOString().split("T")[0];
      const { data: entries } = await supabase
        .from("pool_entries")
        .select("id, pools!inner(pool_date, time_slot)")
        .eq("user_id", data.user.id)
        .eq("checked_in", false)
        .eq("pools.pool_date", today)
        .limit(1);

      if (entries && entries.length > 0) {
        setEntry(entries[0]);
      } else {
        setMessage("No check-in scheduled for today.");
      }
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
          setMessage("");
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
  }, [isRunning, failed, entry]);

  const parseTimeSlot = (slot) => {
    const [timePart, meridiem] = slot.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const startTimer = () => {
    if (completed || failed) return;
    if (!entry) {
      setMessage("No check-in scheduled for today.");
      return;
    }

    const deadline = parseTimeSlot(entry.pools.time_slot);
    const windowStart = new Date(deadline.getTime() - 60 * 60 * 1000);
    const windowEnd = new Date(deadline.getTime() + 5 * 60 * 1000);
    const now = new Date();

    if (now < windowStart) {
      const opensAt = windowStart.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      setMessage(`Too early. Check-in opens at ${opensAt}.`);
      return;
    }

    if (now > windowEnd) {
      setFailed(true);
      setMessage("You missed your window.");
      handleFail();
      return;
    }

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
    if (!entry) {
      setMessage("No check-in scheduled for today.");
      return;
    }

    await supabase
      .from("pool_entries")
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq("id", entry.id);

    setMessage("You're checked in! You kept your money.");
  };

  const handleFail = async () => {
    if (!entry) return;

    await supabase
      .from("pool_entries")
      .update({ checked_in: false, checked_in_at: new Date().toISOString() })
      .eq("id", entry.id);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((300 - secondsLeft) / 300) * 100;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8">
      <p className={`text-xs uppercase tracking-widest mb-8 ${failed ? "text-[#FF0000]" : "text-white/40"}`}>Morning Check-in</p>

      <div className={`text-7xl font-bold tracking-tighter mb-10 font-[family-name:var(--font-geist-mono)] ${failed ? "text-[#FF0000]" : "text-white"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full max-w-sm h-3 bg-white/[0.08] rounded-full mb-10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${failed ? "bg-[#FF0000]" : "bg-white"}`}
          style={{ width: `${failed ? 100 : isRunning || completed ? progress : 0}%` }}
        />
      </div>

      {!completed && !isRunning && !failed && (
        <FrameButton
          variant="outline"
          onClick={startTimer}
        >
          Start
        </FrameButton>
      )}

      {failed ? (
        <p className="mt-8 text-sm text-[#FF0000]">
          {message || "Check-in failure! Go to dashboard to see updated balances."}
        </p>
      ) : (
        <p className="mt-8 text-sm text-white/30">{message}</p>
      )}

      <p className="mt-6 text-white/40 text-xs normal-case tracking-normal leading-relaxed max-w-sm text-center">Check in at least 1 hour before your deadline. You have a 5-minute grace period to press &quot;Start&quot; (e.g. 7:00–7:05 AM). Stay on the check-in screen the entire time – if you navigate away for more than 15 seconds at any point, you lose your funds.</p>

      {(completed || failed) && (
        <a href="/dashboard" className={`mt-4 text-sm transition-colors ${failed ? "text-[#FF0000] hover:text-[#FF0000]/80" : "text-white/40 hover:text-white/60"}`}>
          Back to Dashboard &rarr;
        </a>
      )}

      <a href="/welcome" className="block mt-12 text-center text-[10px] text-white normal-case tracking-normal hover:text-white/60 transition-colors">How does xOutput work?</a>
    </div>
  );
}
