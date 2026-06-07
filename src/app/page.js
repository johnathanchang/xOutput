"use client";
import { useState } from "react";

export default function Home() {
  const [stake, setStake] = useState(null);
  const [time, setTime] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2">xOutput</h1>
      <p className="text-gray-400 mb-6">Stake real money on your morning routine.</p>

      <p className="mb-3">Pick your stake:</p>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setStake(5)} className={`px-6 py-3 rounded-lg font-bold ${stake === 5 ? "bg-green-500" : "bg-gray-800"}`}>$5</button>
        <button onClick={() => setStake(10)} className={`px-6 py-3 rounded-lg font-bold ${stake === 10 ? "bg-green-500" : "bg-gray-800"}`}>$10</button>
        <button onClick={() => setStake(20)} className={`px-6 py-3 rounded-lg font-bold ${stake === 20 ? "bg-green-500" : "bg-gray-800"}`}>$20</button>
      </div>

      <p className="mb-3">Select your wake-up deadline:</p>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTime("6:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "6:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>6:00 AM</button>
        <button onClick={() => setTime("7:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "7:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>7:00 AM</button>
        <button onClick={() => setTime("8:00 AM")} className={`px-6 py-3 rounded-lg font-bold ${time === "8:00 AM" ? "bg-green-500" : "bg-gray-800"}`}>8:00 AM</button>
      </div>

      {stake && time && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-lg">Tomorrow you'll be waking up by <span className="font-bold text-green-400">{time}</span> with <span className="font-bold text-green-400">${stake}</span> on the line.</p>
        </div>
      )}
    </div>
  );
}