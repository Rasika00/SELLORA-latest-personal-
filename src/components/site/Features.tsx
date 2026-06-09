import { Monitor, Cpu, Snowflake, Keyboard, type LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  spec: string;
  desc: string;
  accent: "cyan" | "purple" | "blue";
};

const features: Feature[] = [
  {
    icon: Monitor,
    title: "Display",
    spec: "OLED · 4K · 240Hz",
    desc: "Pixel-perfect HDR with 1ms response and 100% DCI-P3 color volume.",
    accent: "cyan",
  },
  {
    icon: Cpu,
    title: "GPU",
    spec: "RTX 5090 · 24GB",
    desc: "Desktop-class ray tracing with on-chip neural rendering acceleration.",
    accent: "purple",
  },
  {
    icon: Snowflake,
    title: "Cooling",
    spec: "Liquid Vapor Chamber",
    desc: "Triple-fan vector flow keeps silicon at full clock — silently.",
    accent: "blue",
  },
  {
    icon: Keyboard,
    title: "Keyboard",
    spec: "Per-Key RGB · 1.7mm",
    desc: "Optical-mechanical switches with N-key rollover for esports precision.",
    accent: "cyan",
  },
];

const glow = {
  cyan: "shadow-[0_0_40px_oklch(0.78_0.18_200/0.45)] border-neon-cyan/60",
  purple: "shadow-[0_0_40px_oklch(0.62_0.24_295/0.45)] border-neon-purple/60",
  blue: "shadow-[0_0_40px_oklch(0.7_0.22_260/0.45)] border-neon-blue/60",
};

const iconBg = {
  cyan: "bg-neon-cyan/15 text-neon-cyan",
  purple: "bg-neon-purple/15 text-neon-purple",
  blue: "bg-neon-blue/15 text-neon-blue",
};

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-grid-sm opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs tracking-[0.3em] text-neon-cyan">
            ENGINEERED TO DOMINATE
          </p>
          <h2 className="font-display mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
            Built from the <span className="text-gradient">silicon up</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every component re-engineered. Every millimeter justified.
            Hover to feel the architecture.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group relative cursor-pointer rounded-2xl glass p-6 neon-border-hover ${glow[f.accent]} hover:rotate-[-0.5deg]`}
              >
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg[f.accent]} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xs tracking-[0.25em] text-muted-foreground">
                  {f.title.toUpperCase()}
                </h3>
                <p className="mt-2 font-display text-2xl font-bold leading-tight">
                  {f.spec}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
