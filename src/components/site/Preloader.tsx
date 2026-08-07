import { useEffect, useState, useRef } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Interactive Maelstrom Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = width / 2;
    let targetY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const numParticles = window.innerWidth < 768 ? 250 : 500;

    class Particle {
      x: number = 0;
      y: number = 0;
      angle: number;
      distance: number;
      baseSpeed: number;
      speed: number;
      color: string;
      size: number;
      orbitElipseFactor: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * Math.max(width, height) * 1.5;
        this.baseSpeed = 0.005 + Math.random() * 0.02;
        this.speed = this.baseSpeed;
        this.size = Math.random() * 2.5 + 0.5;
        this.orbitElipseFactor = 0.5 + Math.random() * 0.5;

        // Brand colors with varying opacities
        const colors = [
          `rgba(0, 242, 254, ${Math.random() * 0.6 + 0.2})`, // Neon Cyan
          `rgba(189, 0, 255, ${Math.random() * 0.6 + 0.2})`, // Neon Purple
          `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`, // Silver/White wisps
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Particles move faster as they get closer to the center
        this.speed = this.baseSpeed + (200 / Math.max(this.distance, 10)) * 0.01;
        this.angle -= this.speed;

        // Pull towards center
        this.distance -= this.distance * 0.015 + 0.5;

        if (this.distance < 5) {
          this.distance = Math.max(width, height) * (1 + Math.random() * 0.5);
          this.angle = Math.random() * Math.PI * 2;
        }

        // Add some organic wobble
        const wobble = Math.sin(this.distance * 0.05) * 10;

        this.x = mouseX + Math.cos(this.angle) * this.distance + wobble;
        this.y = mouseY + Math.sin(this.angle) * this.distance * this.orbitElipseFactor + wobble;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      // Smooth interpolation of mouse position for the vortex center
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Trail effect: clear with slight opacity to leave fading trails
      ctx.fillStyle = "rgba(11, 15, 25, 0.12)"; // Base background color #0B0F19
      ctx.fillRect(0, 0, width, height);

      // Core glow
      const coreGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      coreGradient.addColorStop(0.2, "rgba(0, 242, 254, 0.1)");
      coreGradient.addColorStop(0.5, "rgba(189, 0, 255, 0.05)");
      coreGradient.addColorStop(1, "transparent");

      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, width, height);

      // Apply composition for glowing look
      ctx.globalCompositeOperation = "screen";

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0F19] font-mono text-neon-cyan transition-opacity duration-700 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 pointer-events-none">
        
        {/* Sleek Minimalist Logo */}
        <div className="flex flex-col items-center gap-6 mb-16 animate-fade-up">
          <img 
            src="/logo.png" 
            alt="SELLORA" 
            className="h-24 w-auto object-contain opacity-90 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" 
          />
          <h1 className="font-display text-4xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            SELLORA
          </h1>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          
          <div className="flex justify-between w-full px-1 text-[10px] uppercase tracking-widest text-white/70 font-medium">
            <span className="animate-pulse">{TELEMETRY_MESSAGES[telemetryIndex]}</span>
            <span>{progress}%</span>
          </div>

          {/* Thin, Elegant Progress Bar */}
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
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
