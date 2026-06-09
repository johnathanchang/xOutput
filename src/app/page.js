"use client";
import { FrameButton } from "@/components/ui/frame-button";

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center max-w-lg text-center">
        <h1 className="text-6xl font-bold tracking-tight mb-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          <span className="normal-case tracking-normal">xOutput</span>
        </h1>
        <p className="text-white/40 text-lg mb-10 font-light">
          Stake real money on your morning routine.
        </p>
        <FrameButton
          variant="default"
          className="w-full max-w-xs"
          onClick={() => window.location.href = "/signup"}
        >
          Get Started
        </FrameButton>
        <a
          href="/login"
          className="mt-4 text-white/30 text-sm hover:text-white/50 transition-colors"
        >
          Already have an account?
        </a>
      </div>
    </div>
  );
}
