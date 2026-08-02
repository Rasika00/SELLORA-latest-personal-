import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Box,
  Cpu,
  Database,
  Eye,
  Filter,
  Layers,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  Terminal,
  Trash2,
  TrendingUp,
  Users,
  X,
  Check,
  Edit3,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Zap
} from "lucide-react";
import { products as initialProducts, type Product } from "@/data/products";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type Order = {
  id: string;
  customer: string;
  rigName: string;
  price: number;
  sector: string;
  status: "Processing" | "Quantum Assembly" | "In Transit" | "Deployed";
  date: string;
};

const initialOrders: Order[] = [
  { id: "ORD-9941-QKD", customer: "Rasika Priyanath", rigName: "Phantom X9", price: 389900, sector: "Sector 4 (Neo-Tokyo)", status: "In Transit", date: "2 mins ago" },
  { id: "ORD-9940-CYN", customer: "Pasindu Diwakara", rigName: "Forge W17", price: 519900, sector: "Sector 1 (Silicon Bay)", status: "Quantum Assembly", date: "14 mins ago" },
  { id: "ORD-9939-NEO", customer: "Madawa Wishwajith", rigName: "Atelier Pro", price: 429900, sector: "Sector 7 (Geneva Hub)", status: "Deployed", date: "1 hour ago" },
  { id: "ORD-9938-SYS", customer: "Rusiru Sulakkana", rigName: "Strike R15", price: 289900, sector: "Sector 2 (London Hyperport)", status: "Processing", date: "3 hours ago" },
  { id: "ORD-9937-HEX", customer: "Kasun Kalhara", rigName: "Studio 16", price: 369900, sector: "Sector 9 (Orbital Station)", status: "Deployed", date: "5 hours ago" },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders">("overview");
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [systemOverride, setSystemOverride] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    badge: "NEW SPECS",
    badgeColor: "cyan",
    category: "Gaming",
    processor: "Intel i9",
    price: 3499,
    cpu: "Ultra 9 285H",
    ram: "32GB DDR5",
    gpu: "RTX 5080",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80"
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const priceVal = Number(newProduct.price) || 299900;
    const created: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      badge: newProduct.badge || "NEW RIG",
      badgeColor: newProduct.badgeColor || "cyan",
      category: newProduct.category || "Gaming",
      processor: newProduct.processor || "Intel i9",
      price: priceVal,
      priceUsd: `$${Math.round(priceVal / 100).toLocaleString()}`,
      cpu: newProduct.cpu || "Next Gen CPU",
      ram: newProduct.ram || "32GB",
      gpu: newProduct.gpu || "RTX 5080",
      display: '16.0" QHD+ 240Hz Fast-IPS',
      batteryWeight: "90Wh (Up to 8 hrs) · 2.3 kg",
      specialHighlight: "Custom Configured Rig with Extreme Performance Engine",
      img: newProduct.img || "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80"
    };

    setProductList([created, ...productList]);
    setIsModalOpen(false);
    showToast(`Rig Deployed to Catalog: ${created.name}`);
    setNewProduct({ name: "", badge: "NEW SPECS", badgeColor: "cyan", category: "Gaming", processor: "Intel i9", price: 3499, cpu: "Ultra 9 285H", ram: "32GB DDR5", gpu: "RTX 5080", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80" });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProductList(productList.filter(p => p.id !== id));
    showToast(`Rig Purged from Inventory: ${name}`);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrderList(orderList.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} status updated to ${newStatus}`);
  };

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orderList.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.rigName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-neon-cyan/30 overflow-x-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up rounded-2xl border border-neon-cyan bg-black/90 px-5 py-3.5 text-sm font-mono text-neon-cyan shadow-neon-cyan flex items-center gap-3 backdrop-blur-xl">
          <Zap className="h-4 w-4 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Command Bar */}
      <header className="sticky top-0 z-40 border-b border-glass-border bg-black/80 backdrop-blur-2xl px-3 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-3.5">
        <div className="mx-auto flex w-full max-w-full items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-primary shadow-neon-cyan flex items-center justify-center font-display font-black text-background text-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-black tracking-widest leading-none group-hover:text-neon-cyan transition-colors">SELLORA</span>
                <span className="text-[10px] font-mono text-neon-cyan tracking-widest uppercase">Command Center</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-neon-cyan">
                <Activity className="h-3.5 w-3.5 animate-pulse" /> CORE LOAD: 31%
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
                <Cpu className="h-3.5 w-3.5 text-neon-purple" /> QKD SYNCHRONIZED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSystemOverride(!systemOverride);
                showToast(systemOverride ? "System Override Disengaged" : "High-Output System Override Engaged!");
              }}
              className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider border transition-all ${
                systemOverride
                  ? "bg-destructive/20 border-destructive text-destructive shadow-[0_0_20px_oklch(0.65_0.25_25/0.4)] animate-pulse"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {systemOverride ? "OVERRIDE ACTIVE" : "Normal Mode"}
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-xl border border-glass-border bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-neon-cyan hover:text-neon-cyan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock Terminal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid Body */}
      <div className="mx-auto flex w-full max-w-full flex-1 flex-col md:flex-row gap-6 md:gap-8 px-3 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <nav className="flex md:flex-col gap-1.5 rounded-2xl border border-glass-border bg-card/40 p-2 backdrop-blur-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all shrink-0 ${
                activeTab === "overview"
                  ? "bg-gradient-primary text-background font-bold shadow-neon-cyan"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Telemetry Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all shrink-0 ${
                activeTab === "inventory"
                  ? "bg-gradient-primary text-background font-bold shadow-neon-cyan"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Box className="h-4 w-4 shrink-0" />
                <span>Rig Inventory</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${activeTab === "inventory" ? "bg-black/30 text-background" : "bg-white/10 text-neon-cyan"}`}>
                {productList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all shrink-0 ${
                activeTab === "orders"
                  ? "bg-gradient-primary text-background font-bold shadow-neon-cyan"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span>Dispatch & Orders</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${activeTab === "orders" ? "bg-black/30 text-background" : "bg-white/10 text-neon-purple"}`}>
                {orderList.length}
              </span>
            </button>
          </nav>

          {/* Sidebar System Status Card */}
          <div className="mt-4 hidden md:block rounded-2xl border border-glass-border bg-black/40 p-4 text-xs font-mono text-muted-foreground backdrop-blur-md">
            <div className="flex items-center justify-between text-foreground font-semibold mb-2">
              <span>NEURAL MESH</span>
              <span className="text-neon-cyan">OPTIMAL</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Bandwidth</span>
                  <span>84.2 GB/s</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[84%] bg-gradient-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>QKD Key Refresh</span>
                  <span>14s remaining</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[60%] bg-neon-purple rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Search Bar for inventory / orders */}
          {(activeTab === "inventory" || activeTab === "orders") && (
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={activeTab === "inventory" ? "Search rig designation, category or CPU..." : "Search order ID, sector or buyer..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-glass-border bg-black/60 pl-10 pr-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                />
              </div>

              {activeTab === "inventory" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-background shadow-neon-cyan transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  Deploy New Rig
                </button>
              )}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-up">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-glass-border bg-card/60 p-5 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-neon-cyan/10 rounded-bl-full blur-xl group-hover:bg-neon-cyan/20 transition-all" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Gross Neural Volume</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-foreground">Rs 482,919,000</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-neon-cyan">
                    <TrendingUp className="h-3.5 w-3.5" /> +18.4% vs last orbital cycle
                  </div>
                </div>

                <div className="rounded-2xl border border-glass-border bg-card/60 p-5 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-neon-purple/10 rounded-bl-full blur-xl group-hover:bg-neon-purple/20 transition-all" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Active Rigs Deployed</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-foreground">1,482</span>
                    <span className="text-xs text-muted-foreground font-mono">UNITS</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-neon-purple">
                    <Activity className="h-3.5 w-3.5" /> 99.98% Telemetry Uptime
                  </div>
                </div>

                <div className="rounded-2xl border border-glass-border bg-card/60 p-5 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-neon-blue/10 rounded-bl-full blur-xl group-hover:bg-neon-blue/20 transition-all" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Pending Dispatch</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-foreground">{orderList.filter(o => o.status !== "Deployed").length}</span>
                    <span className="text-xs text-muted-foreground font-mono">ORDERS</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-neon-cyan">
                    <Layers className="h-3.5 w-3.5" /> Priority Quantum Assembly
                  </div>
                </div>
              </div>

              {/* Graphical Sector Allocation Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-3xl border border-glass-border bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">Sector Deployment Velocity</h3>
                      <p className="text-xs text-muted-foreground font-mono">Simulated real-time throughput by rig class</p>
                    </div>
                    <span className="rounded-lg bg-neon-cyan/10 px-3 py-1 text-xs font-mono text-neon-cyan border border-neon-cyan/30">
                      LIVE TELEMETRY
                    </span>
                  </div>

                  {/* Simulated Visual Bars */}
                  <div className="space-y-5 my-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-foreground font-semibold flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon-cyan" /> GAMING BEAST SERIES (Phantom X9 / Strike R15)</span>
                        <span className="text-neon-cyan">64.2% (840 Units)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/5">
                        <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-neon-cyan/60 to-neon-cyan shadow-neon-cyan/40 transition-all duration-1000" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-foreground font-semibold flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon-purple" /> CREATOR & ULTRABOOK (Atelier Pro / Studio 16)</span>
                        <span className="text-neon-purple">24.8% (312 Units)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/5">
                        <div className="h-full w-[25%] rounded-full bg-gradient-to-r from-neon-purple/60 to-neon-purple shadow-neon-purple/40 transition-all duration-1000" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-foreground font-semibold flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon-blue" /> HEAVY WORKSTATIONS (Forge W17)</span>
                        <span className="text-neon-blue">11.0% (148 Units)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-black/60 p-0.5 border border-white/5">
                        <div className="h-full w-[11%] rounded-full bg-gradient-to-r from-neon-blue/60 to-neon-blue transition-all duration-1000" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Peak Throughput: 142 rigs / hr</span>
                    <button onClick={() => showToast("Telemetry buffers flushed.")} className="text-neon-cyan hover:underline flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Recalibrate Sensors
                    </button>
                  </div>
                </div>

                {/* Quick Action Hub */}
                <div className="rounded-3xl border border-glass-border bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground mb-1">Command Actions</h3>
                    <p className="text-xs text-muted-foreground font-mono mb-6">Immediate system execution</p>

                    <div className="space-y-3">
                      <button
                        onClick={() => { setActiveTab("inventory"); setIsModalOpen(true); }}
                        className="w-full flex items-center justify-between rounded-2xl border border-neon-cyan/40 bg-neon-cyan/10 p-3.5 text-left transition-all hover:bg-neon-cyan/20 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-neon-cyan p-2 text-background">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-display text-xs font-bold uppercase text-foreground">Deploy New Rig</div>
                            <div className="text-[11px] text-muted-foreground">Initialize spec configuration</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neon-cyan transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        onClick={() => showToast("Micro-kernel AI patch broadcasted to all active units.")}
                        className="w-full flex items-center justify-between rounded-2xl border border-glass-border bg-black/40 p-3.5 text-left transition-all hover:border-white/20 hover:bg-white/5 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/10 p-2 text-neon-purple">
                            <Terminal className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-display text-xs font-bold uppercase text-foreground">Broadcast AI Patch</div>
                            <div className="text-[11px] text-muted-foreground">Push NPU optimization v4.2</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </button>

                      <button
                        onClick={() => showToast("Quantum cache purged across all 9 orbital servers.")}
                        className="w-full flex items-center justify-between rounded-2xl border border-glass-border bg-black/40 p-3.5 text-left transition-all hover:border-white/20 hover:bg-white/5 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white/10 p-2 text-neon-cyan">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-display text-xs font-bold uppercase text-foreground">Purge Edge Cache</div>
                            <div className="text-[11px] text-muted-foreground">Clear neural CDN routing</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-neon-purple/20 to-transparent p-4 border border-neon-purple/30">
                    <div className="text-xs font-mono font-semibold text-neon-purple uppercase mb-1">AI Diagnostics Active</div>
                    <p className="text-[11px] text-muted-foreground">All hardware thermal thresholds nominal across SELLORA client fleet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-4 animate-fade-up">
              <div className="rounded-3xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="p-4 pl-6">Rig Profile</th>
                        <th className="p-4">Badge / Classification</th>
                        <th className="p-4">Processor & Specs</th>
                        <th className="p-4">Unit Valuation</th>
                        <th className="p-4 text-right pr-6">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredProducts.map((product) => {
                        const badgeColorClass =
                          product.badgeColor === "cyan" ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" :
                          product.badgeColor === "purple" ? "border-neon-purple/40 bg-neon-purple/10 text-neon-purple" :
                          "border-neon-blue/40 bg-neon-blue/10 text-neon-blue";

                        return (
                          <tr key={product.id} className="transition-colors hover:bg-white/[0.03] group">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={product.img}
                                  alt={product.name}
                                  className="h-12 w-16 rounded-xl object-cover border border-glass-border shrink-0"
                                />
                                <div>
                                  <div className="font-display font-bold text-foreground group-hover:text-neon-cyan transition-colors">
                                    {product.name}
                                  </div>
                                  <div className="text-xs font-mono text-muted-foreground">
                                    ID: {product.id} • {product.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-display text-[10px] uppercase tracking-wider ${badgeColorClass}`}>
                                {product.badge}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-mono text-xs text-foreground">{product.cpu}</div>
                              <div className="text-xs text-muted-foreground font-mono">{product.gpu} • {product.ram}</div>
                            </td>
                            <td className="p-4 font-display font-bold text-base text-foreground">
                              Rs {product.price.toLocaleString()}
                            </td>
                            <td className="p-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to="/product/$productId"
                                  params={{ productId: product.id }}
                                  className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-neon-cyan transition-colors"
                                  title="Inspect Rig page"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                                  title="Decommission Rig"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-muted-foreground font-mono">
                            No matching rig profiles found in current sector database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4 animate-fade-up">
              <div className="rounded-3xl border border-glass-border bg-card/60 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="p-4 pl-6">Tracking Identifier</th>
                        <th className="p-4">Operative / Buyer</th>
                        <th className="p-4">Rig Model Deployed</th>
                        <th className="p-4">Sector Destination</th>
                        <th className="p-4">Dispatch Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredOrders.map((order) => {
                        const statusColor =
                          order.status === "Deployed" ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40" :
                          order.status === "In Transit" ? "bg-neon-purple/15 text-neon-purple border-neon-purple/40" :
                          order.status === "Quantum Assembly" ? "bg-amber-500/15 text-amber-400 border-amber-500/40" :
                          "bg-white/10 text-muted-foreground border-white/20";

                        return (
                          <tr key={order.id} className="transition-colors hover:bg-white/[0.03]">
                            <td className="p-4 pl-6 font-mono font-bold text-foreground">
                              {order.id}
                              <div className="text-[10px] text-muted-foreground font-normal">{order.date}</div>
                            </td>
                            <td className="p-4 font-medium text-foreground">{order.customer}</td>
                            <td className="p-4 font-display text-xs font-semibold text-foreground">{order.rigName} (Rs {order.price.toLocaleString()})</td>
                            <td className="p-4 font-mono text-xs text-muted-foreground">{order.sector}</td>
                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-mono font-semibold focus:outline-none cursor-pointer transition-all ${statusColor}`}
                              >
                                <option value="Processing" className="bg-black text-foreground">Processing</option>
                                <option value="Quantum Assembly" className="bg-black text-foreground">Quantum Assembly</option>
                                <option value="In Transit" className="bg-black text-foreground">In Transit</option>
                                <option value="Deployed" className="bg-black text-foreground">Deployed</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: DEPLOY NEW RIG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-up">
          <div className="relative w-full max-w-2xl rounded-3xl border border-glass-border bg-card p-6 sm:p-8 shadow-elevated max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-primary p-2.5 text-background">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">Deploy New Rig Profile</h3>
                  <p className="text-xs text-muted-foreground font-mono">Register hardware specs into orbital inventory catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Rig Designation Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex G19"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none"
                  >
                    <option value="Gaming">Gaming</option>
                    <option value="Ultrabook">Ultrabook</option>
                    <option value="Workstation">Workstation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Badge Text</label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none font-mono text-xs uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Badge Color</label>
                  <select
                    value={newProduct.badgeColor}
                    onChange={(e) => setNewProduct({ ...newProduct, badgeColor: e.target.value as any })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none"
                  >
                    <option value="cyan">Electric Cyan</option>
                    <option value="purple">Electric Purple</option>
                    <option value="blue">Neon Blue</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Price (Rs)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">CPU Spec</label>
                  <input
                    type="text"
                    placeholder="i9-15900HX"
                    value={newProduct.cpu}
                    onChange={(e) => setNewProduct({ ...newProduct, cpu: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">RAM Spec</label>
                  <input
                    type="text"
                    placeholder="64GB DDR5"
                    value={newProduct.ram}
                    onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">GPU Spec</label>
                  <input
                    type="text"
                    placeholder="RTX 5090"
                    value={newProduct.gpu}
                    onChange={(e) => setNewProduct({ ...newProduct, gpu: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-black/60 px-4 py-2.5 text-base sm:text-sm text-foreground focus:border-neon-cyan focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-glass-border px-5 py-2.5 text-xs font-mono text-muted-foreground hover:bg-white/5 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-primary px-6 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-background shadow-neon-cyan hover:scale-105 transition-transform"
                >
                  INITIALIZE & DEPLOY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
