import { useEffect, useState } from "react";

const TELEMETRY_MESSAGES = [
  "INITIALIZING SYSTEM DECK...",
  "BOOTING HARDWARE DATABASE...",
  "CALIBRATING NEURAL CORES...",
  "LOADING RTX NODES...",
  "SYNCHRONIZING SHOWDOWN ARENA...",
  "OPTIMIZING THERMAL DYNAMICS...",
  "SYSTEM ONLINE.",
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 1;
        return next >= 100 ? 100 : next;
      });
    }, 100);

    // Update telemetry messages based on progress
    const messageInterval = setInterval(() => {
      setTelemetryIndex((prev) => {
        if (prev < TELEMETRY_MESSAGES.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTelemetryIndex(TELEMETRY_MESSAGES.length - 1);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 800); // Wait for fade out animation
      }, 500);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F19] font-mono text-neon-cyan transition-opacity duration-700 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Grid Lines & Glow */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-12 animate-pulse">
          <div className="relative flex items-center justify-center w-32 h-32 mb-2">
            <div className="absolute inset-0 rounded-2xl border-2 border-neon-cyan/50 shadow-[0_0_20px_oklch(0.78_0.18_200/0.4)] animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-2 rounded-xl border border-neon-purple/50 shadow-[0_0_15px_oklch(0.62_0.24_295/0.4)] animate-[spin_3s_linear_infinite_reverse]" />
            <img src="/logo.png" alt="SELLORA" className="relative z-10 h-20 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
          </div>
          <h1 className="font-display text-5xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            SELLORA
          </h1>
        </div>

        {/* Loader Container */}
        <div className="w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          
          {/* Top Telemetry & Percentage */}
          <div className="flex justify-between items-end mb-3 text-xs">
            <span className="text-neon-purple tracking-widest font-semibold uppercase animate-pulse">
              {TELEMETRY_MESSAGES[telemetryIndex]}
            </span>
            <span className="text-xl font-bold tracking-wider text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-[#00ffcc] shadow-[0_0_10px_oklch(0.78_0.18_200/0.8)] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
          
          {/* Bottom decorative details */}
          <div className="flex justify-between items-center mt-3 text-[10px] text-muted-foreground/60">
            <span>SYS.VER 4.2.9</span>
            <span>SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </div>
      
      {/* Custom Keyframes for Shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
