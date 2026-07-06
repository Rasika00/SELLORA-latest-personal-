import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cpu, MemoryStick, Zap, Fingerprint, Shield, Battery, Expand } from "lucide-react";
import { products } from "@/data/products";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetails,
});

function ProductDetails() {
  const { productId } = Route.useParams();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Laptop not found</h1>
          <Link to="/" className="mt-4 inline-block text-neon-cyan hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  // Determine glow color class based on badgeColor
  const glowColor =
    product.badgeColor === "cyan" ? "bg-neon-cyan/20" :
    product.badgeColor === "purple" ? "bg-neon-purple/20" :
    "bg-neon-blue/20";
    
  const textColor = 
    product.badgeColor === "cyan" ? "text-neon-cyan" :
    product.badgeColor === "purple" ? "text-neon-purple" :
    "text-neon-blue";

  const borderColor = 
    product.badgeColor === "cyan" ? "border-neon-cyan/40" :
    product.badgeColor === "purple" ? "border-neon-purple/40" :
    "border-neon-blue/40";

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-neon-cyan/30">
      <Navbar />
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-32 isolate">
        <div className="absolute inset-0 -z-20 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        
        {/* Massive overlapping text */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
          <h1 className="font-display text-[14vw] font-black uppercase text-foreground/5 whitespace-nowrap select-none tracking-tighter">
            {product.category}
          </h1>
        </div>

        {/* Ambient Glows */}
        <div className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowColor} blur-[100px] animate-glow-pulse`} />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12">
          <Link to="/" className="group mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to grid
          </Link>

          <div className="flex flex-col items-center text-center max-w-full px-2">
            <span className={`mb-6 rounded-full border px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_oklch(0.78_0.18_200/0.3)] ${borderColor} ${textColor} bg-white/5 backdrop-blur-md animate-fade-up max-w-full truncate`}>
              {product.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase animate-fade-up break-words max-w-full [animation-delay:0.1s]">
              {product.name}
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground animate-fade-up break-words [animation-delay:0.2s]">
              Engineered with {product.processor}. Built for unprecedented performance.
            </p>
          </div>

          <div className="relative mt-16 flex justify-center animate-fade-up [animation-delay:0.4s]">
            <div className="group relative w-full max-w-5xl overflow-hidden rounded-3xl border border-glass-border bg-black/60 shadow-[0_0_80px_rgba(0,0,0,0.8)] neon-border">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={product.img}
                  alt={`${product.name} High Resolution Render`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              </div>
              
              {/* Decorative HUD Elements */}
              <div className="absolute top-6 left-6 hidden md:flex flex-col gap-1 rounded-lg glass px-3 py-2 text-[10px] text-muted-foreground tracking-[0.2em] font-mono backdrop-blur-md">
                <span className="text-neon-cyan">SYS.STATUS: OPTIMAL</span>
                <span>TEMP: 32°C</span>
                <span>VOLTAGE: 1.2V</span>
              </div>
              <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 rounded-full glass px-4 py-2 text-[10px] text-neon-cyan tracking-[0.2em] font-mono backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse shadow-neon-cyan" />
                LINK ACTIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications HUD Section */}
      <section className="relative py-24 bg-black/50 border-y border-glass-border">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-12">
          <div className="mb-16 flex items-center justify-between border-b border-glass-border pb-4">
            <h3 className="font-display text-sm tracking-[0.3em] text-muted-foreground">TECHNICAL SPECIFICATIONS</h3>
            <Expand className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <HUDCard icon={Cpu} label="Compute Core" value={product.cpu} desc="Next gen architecture" color="cyan" />
            <HUDCard icon={MemoryStick} label="System Memory" value={product.ram} desc="Ultra low latency" color="purple" />
            <HUDCard icon={Zap} label="Graphics Engine" value={product.gpu} desc="Ray tracing enabled" color="blue" />
            <HUDCard icon={Expand} label="Display" value="16 inch OLED" desc="240Hz refresh rate" color="cyan" />
            <HUDCard icon={Battery} label="Power" value="99.9Wh" desc="All day battery life" color="purple" />
            <HUDCard icon={Shield} label="Security" value="Zero Trust" desc="Hardware encryption" color="blue" />
          </div>
        </div>
      </section>

      {/* Sticky Command Center / Footer Spacer */}
      <div className="h-32" /> 

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-glass-border bg-background/90 backdrop-blur-xl px-4 sm:px-8 md:px-12 py-3 sm:py-4 animate-fade-up">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Configure from</span>
            <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
              Rs {product.price.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap w-full sm:w-auto gap-2.5 sm:gap-3">
            <button className="flex-1 sm:flex-none rounded-full glass-strong px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold transition-all hover:bg-white/10 text-center whitespace-normal sm:whitespace-nowrap">
              Save to Wishlist
            </button>
            <button className="flex-1 sm:flex-none rounded-full bg-gradient-primary px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-[0_0_30px_oklch(0.78_0.18_200/0.3)] transition-transform hover:scale-105 text-center whitespace-normal sm:whitespace-nowrap">
              Configure & Buy
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function HUDCard({ icon: Icon, label, value, desc, color }: { icon: React.ElementType, label: string, value: string, desc: string, color: string }) {
  const glow = 
    color === "cyan" ? "group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_20px_oklch(0.78_0.18_200/0.2)]" :
    color === "purple" ? "group-hover:border-neon-purple/50 group-hover:shadow-[0_0_20px_oklch(0.62_0.24_295/0.2)]" :
    "group-hover:border-neon-blue/50 group-hover:shadow-[0_0_20px_oklch(0.7_0.22_260/0.2)]";

  const iconColor =
    color === "cyan" ? "text-neon-cyan" :
    color === "purple" ? "text-neon-purple" :
    "text-neon-blue";

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl glass p-6 md:p-8 transition-all duration-500 ${glow}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-30 pointer-events-none">
        <Icon className={`h-24 w-24 ${iconColor}`} />
      </div>
      <div>
        <Icon className={`mb-6 h-8 w-8 shrink-0 ${iconColor}`} />
        <p className="mb-2 font-display text-[10px] tracking-[0.2em] text-muted-foreground uppercase truncate">{label}</p>
        <p className="mb-1 font-display text-xl sm:text-2xl font-bold break-words">{value}</p>
      </div>
      <p className="mt-2 text-xs text-muted-foreground/60 leading-relaxed">{desc}</p>
    </div>
  );
}
