"use client";
import { FrameButton } from "@/components/ui/frame-button";

export default function Welcome() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-1 normal-case tracking-normal">Welcome to xOutput.</h1>

        <div className="mt-8 space-y-5 text-sm text-white/60 normal-case tracking-normal leading-relaxed">
          <p>
            Every morning, millions of people wake up and immediately reach for their phone. Before they&apos;ve even gotten out of bed, they&apos;ve already lost 30, 45, maybe 60 minutes to Instagram, TikTok, and Twitter. The day starts in a hole.
          </p>

          <p>
            xOutput fixes that by making it expensive to fail.
          </p>

          <p>
            Here&apos;s how it works: the night before, you join a pool and put real money on the line. In the morning, you complete your check-in to prove you didn&apos;t doomscroll. If you follow through, you keep your money. If you don&apos;t, it goes to the people who did.
          </p>

          <p>
            That&apos;s it. No streaks. No badges. No motivational notifications. Just cold, hard consequences.
          </p>

          <p>
            Because the truth is, you <span className="uppercase tracking-widest font-bold text-white">already know</span> you shouldn&apos;t be doomscrolling. You don&apos;t need another <span className="uppercase tracking-widest font-bold text-white">reminder</span>. You need a <span className="uppercase tracking-widest font-bold text-white">reason</span>.
          </p>

          <p className="font-bold text-white">
            xOutput gives you one.
          </p>
        </div>

        <div className="mt-10">
          <FrameButton
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = "/dashboard"}
          >
            Go to Dashboard
          </FrameButton>
        </div>
      </div>
    </div>
  );
}
