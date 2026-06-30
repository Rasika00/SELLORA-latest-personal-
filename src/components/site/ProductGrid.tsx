import { useMemo, useState } from "react";
import { Cpu, MemoryStick, Zap, Plus, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";

const badgeStyles = {
  cyan: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_20px_oklch(0.78_0.18_200/0.4)]",
  purple: "bg-neon-purple/15 text-neon-purple border-neon-purple/40 shadow-[0_0_20px_oklch(0.62_0.24_295/0.4)]",
  blue: "bg-neon-blue/15 text-neon-blue border-neon-blue/40 shadow-[0_0_20px_oklch(0.7_0.22_260/0.4)]",
};

const categories = ["Gaming", "Ultrabook", "Workstation"] as const;
const processors = ["Intel i9", "AMD Ryzen 9", "Apple M-Max"] as const;

export function ProductGrid() {
  const [cats, setCats] = useState<string[]>([]);
  const [procs, setProcs] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(6000);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (procs.length && !procs.includes(p.processor)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [cats, procs, maxPrice]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  return (
    <section id="products" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-96 w-96 rounded-full bg-neon-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-neon-cyan/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-neon-cyan">THE LAPTOP DECK</p>
            <h2 className="font-display mt-3 text-4xl font-black uppercase tracking-tight md:text-5xl">
              Choose your <span className="text-gradient">weapon</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            {filtered.length} machines · Engineered, benchmarked, and shipped from orbit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl glass p-5 neon-border">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-neon-cyan" />
                <h3 className="font-display text-sm tracking-[0.2em]">FILTERS</h3>
              </div>

              <FilterGroup label="CATEGORY">
                {categories.map((c) => (
                  <Chip key={c} active={cats.includes(c)} onClick={() => toggle(cats, setCats, c)}>
                    {c}
                  </Chip>
                ))}
              </FilterGroup>

              <FilterGroup label="PROCESSOR">
                {processors.map((p) => (
                  <Chip key={p} active={procs.includes(p)} onClick={() => toggle(procs, setProcs, p)}>
                    {p}
                  </Chip>
                ))}
              </FilterGroup>

              <FilterGroup label="MAX PRICE">
                <div className="px-1">
                  <input
                    type="range"
                    min={1500}
                    max={6000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[oklch(0.78_0.18_200)]"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>$1.5K</span>
                    <span className="font-display text-neon-cyan">${maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </FilterGroup>

              <button
                onClick={() => { setCats([]); setProcs([]); setMaxPrice(6000); }}
                className="mt-4 w-full rounded-lg border border-glass-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Reset filters
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="group relative flex flex-col overflow-hidden rounded-2xl glass neon-border-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <img
                    src={p.img}
                    alt={`${p.name} laptop product render`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-display text-[10px] tracking-[0.2em] ${badgeStyles[p.badgeColor]}`}>
                    {p.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold tracking-wide">{p.name}</h3>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <SpecPill icon={Cpu} label={p.cpu} />
                    <SpecPill icon={MemoryStick} label={p.ram} />
                    <SpecPill icon={Zap} label={p.gpu} />
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">From</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        ${p.price.toLocaleString()}
                      </p>
                    </div>
                    <button className="group/btn inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105 hover:shadow-neon-cyan">
                      <Plus className="h-3.5 w-3.5" />
                      Add to Deck
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl glass p-12 text-center text-muted-foreground">
                No machines match your filters. Try widening the search.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-t border-glass-border pt-4 first:border-t-0 first:pt-0">
      <p className="mb-3 font-display text-[10px] tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
        active
          ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan shadow-[0_0_15px_oklch(0.78_0.18_200/0.35)]"
          : "border-glass-border bg-white/[0.02] text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SpecPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex min-w-0 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-glass-border bg-white/[0.02] px-1.5 py-2 text-center">
      <Icon className="h-3.5 w-3.5 shrink-0 text-neon-cyan" />
      <span className="w-full truncate text-center text-[10px] text-muted-foreground leading-tight" title={label}>{label}</span>
    </div>
  );
}
