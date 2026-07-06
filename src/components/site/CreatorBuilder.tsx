import { useState } from "react";
import { Sparkles, Check, ArrowRight } from "lucide-react";

export function CreatorBuilder() {
  // Simple 1-click tier toggle for each machine: 0 = Standard Studio, 1 = Max Power
  const [tiers, setTiers] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });

  const toggleTier = (index: number, tier: number) => {
    setTiers((prev) => ({ ...prev, [index]: tier }));
  };

  const builders = [
    {
      name: "SELLORA ProArt Studio 16",
      tagline: "3D Animation & Video Grading",
      desc: "Built for Cinema4D, Premiere Pro, and DaVinci Resolve with studio-calibrated color accuracy.",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      tiers: [
        {
          label: "Studio Standard",
          price: 180000,
          specs: ["Intel Core Ultra 9 185H", "NVIDIA RTX 4070 (8GB)", "32GB DDR5 • 1TB SSD", "16\" 3.2K 165Hz Mini-LED"],
        },
        {
          label: "Studio Max",
          price: 230000,
          specs: ["Intel Core i9-14900HX", "NVIDIA RTX 4080 (12GB)", "64GB DDR5 • 2TB SSD", "16\" 4K+ Calman OLED"],
        },
      ],
    },
    {
      name: "SELLORA Titan Workstation 18",
      tagline: "AI Training & Heavy Rendering",
      desc: "Vapor chamber thermal armor designed for local LLM inference, PyTorch, and Unreal Engine 5.",
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
      tiers: [
        {
          label: "Render Standard",
          price: 240000,
          specs: ["AMD Ryzen 9 8945HS", "NVIDIA RTX 4080 (12GB)", "32GB DDR5 • 2TB SSD", "18\" QHD+ 240Hz OLED"],
        },
        {
          label: "AI Extreme Max",
          price: 340000,
          specs: ["AMD Ryzen 9 7945HX3D", "NVIDIA RTX 4090 (16GB)", "128GB DDR5 • 4TB SSD", "18\" 4K+ Dual-Mode OLED"],
        },
      ],
    },
    {
      name: "SELLORA OmniBook Ultra 14",
      tagline: "On-The-Go Creator Studio",
      desc: "Aerospace carbon fiber weave weighing just 1.1kg with 18-hour battery life for creators anywhere.",
      img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      tiers: [
        {
          label: "Mobile Standard",
          price: 160000,
          specs: ["Intel Core Ultra 7 155H", "NVIDIA RTX 4060 (8GB)", "16GB DDR5 • 1TB SSD", "14\" 2.8K 120Hz OLED"],
        },
        {
          label: "Mobile Pro",
          price: 195000,
          specs: ["Intel Core Ultra 9 185H", "NVIDIA RTX 4070 (8GB)", "32GB DDR5 • 2TB SSD", "14\" 3K Calman Touch OLED"],
        },
      ],
    },
  ];

  return (
    <section id="creator" className="relative py-24 md:py-32 border-t border-glass-border">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12">
        
        {/* Simple Clean Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3.5 py-1 text-[10px] font-mono font-bold tracking-[0.25em] text-neon-purple uppercase">
            <Sparkles className="h-3 w-3 animate-pulse" /> Creator Studio
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
            Real-World <span className="text-gradient">Laptop Builders</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Purpose-built machines for 3D rendering, AI engineering, and cinematic editing. Select your base platform and choose your power tier.
          </p>
        </div>

        {/* 3 Streamlined Creator Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {builders.map((b, idx) => {
            const currentTier = tiers[idx] || 0;
            const activeData = b.tiers[currentTier];

            return (
              <div
                key={b.name}
                className="group flex flex-col rounded-3xl border border-glass-border bg-card/60 overflow-hidden backdrop-blur-xl transition-all hover:border-white/30 hover:shadow-elevated"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                  <img
                    src={b.img}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-cyan bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                    {b.tagline}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">{b.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[36px]">{b.desc}</p>

                  {/* Tier Toggle Switcher */}
                  <div className="mt-6 flex rounded-xl border border-glass-border bg-black/40 p-1">
                    {b.tiers.map((t, tIdx) => (
                      <button
                        key={t.label}
                        onClick={() => toggleTier(idx, tIdx)}
                        className={`flex-1 rounded-lg py-2 sm:py-1.5 text-xs sm:text-[11px] font-semibold transition-all ${
                          currentTier === tIdx
                            ? "bg-gradient-primary text-background shadow-neon-cyan"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Specs List */}
                  <ul className="mt-6 space-y-2.5 border-t border-glass-border pt-6 text-xs text-muted-foreground">
                    {activeData.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neon-cyan/10 text-neon-cyan">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className="text-foreground font-medium">{spec}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price & Action */}
                  <div className="mt-auto pt-8 flex flex-wrap items-end justify-between gap-4 border-t border-glass-border/50">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Price</span>
                      <span className="font-display text-lg font-bold text-foreground">
                        Rs {activeData.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`🚀 Added ${b.name} (${activeData.label}) to your Creator Deck!`)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-gradient-primary hover:text-background hover:shadow-neon-cyan"
                    >
                      <span>Build Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
